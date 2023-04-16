use helpdesk;

-- drop procedure if it exists
drop procedure if exists sp_getTicketById;

delimiter $$

-- -----------------------------------------------------
-- get ticket by ticket id for edit/view ticket/create comment
--
-- Input parameters:
--
-- 	- in_id: ticket id
-- -----------------------------------------------------

-- call sp_getTicketById(101)

create procedure sp_getTicketById(
									in_id int
									)
begin

-- get ticket and count spent hours
with _ticket_spentHour as(
select 	a.ticketid as ticketid,

		-- creator id + fullname
		concat(a.creatorid, ' - ', coalesce(b.lastName,''),' ',coalesce(b.firstName,'')) as creator,
        
		coalesce(b.phone,'') as creatorPhone,
		coalesce(b.email,'') as creatorEmail,
		a.subject as subject,
		a.content as content,
        
        -- team id + team name + assignment method
		concat(a.teamid, ' - ', coalesce(e.name,''), ' - ',
			case
				-- ticket will be assigned to a certain supporter automatically
				when coalesce(e.assignmentMethod,'') = 'A' then 'Auto'
                -- a supporter will assign ticket to a certain supporter manually
                else 'Manual'
            end
        ) as team,
        
		-- 2023-03-29 10:40:00
		a.createDatetime as createDatetime,
        -- 2023-03-29 11:00:00
		a.lastUpdateDatetime as lastUpdateDatetime,
        -- last updated by user id
		a.lastUpdateByUserid as lastUpdateByUserid,
        -- user id + fullname
        concat(a.lastUpdateByUserid, ' - ', 
			coalesce(h.lastName,''),' ',coalesce(h.firstName,'')) as lastUpdateByUser,
        -- count spent hours. ex: spentHour = 1.3 (hours)
        fn_spentHour(coalesce(d.statusid,0), a.createDatetime, a.lastUpdateDatetime) as spentHour,
		-- count spent 'days-hours-minutes'. ex: spentDayHhmm = '3 days 15 hours 22 minutes'
        fn_spentDayHhmm(coalesce(d.statusid,0), a.createDatetime, a.lastUpdateDatetime) as spentDayHhmm,
        
        a.priorityid as priorityid,
        -- priority = priorityid + name + resolveIn
        concat(a.priorityid, ' - ', coalesce(g.name,''), ' - ', 
			coalesce(g.resolveIn, 0), 
				case
					when coalesce(g.resolveIn, 0) < 2 then ' hour'
                    else ' hours'
                end) as priority,
        
		a.categoryid as categoryid,
        -- category = categoryid + name
        concat(a.categoryid, ' - ', coalesce(f.name,'')) as category,        
        
        coalesce(a.assigneeid, -1) as assigneeid,
        -- assignee = assigneeid + fullname
        concat(coalesce(a.assigneeid, -1), ' - ', 
			coalesce(c.lastName,''), ' ', coalesce(c.firstName,'')) as assignee,          
        
		a.ticketStatusid as ticketStatusid,
		-- ticketStatus = ticketStatusid + name
        concat(a.ticketStatusid, ' - ', coalesce(d.name,'')) as ticketStatus, 
        
        -- customFilename = yyyyMMddHHmmss + UUID + file extension
        -- ex: 20230413161647_f1f239a9-6fed-48ff-a84b-43cea7ffde88.jpg
		a.customFilename as customFilename,
        -- ex: abc.jpg
        coalesce(i.originalFilename,'') as originalFilename,
		--  
		-- limit hours need to resolve the ticket
		coalesce(g.resolveIn, 0) as resolveIn,
        now() as currentDatetime
from ticket a
	-- creator
	left join user b on a.creatorid = b.id
	-- assignee
	left join user c on coalesce(a.assigneeid,-1) = c.id
	left join ticketStatus d on a.ticketStatusid = d.statusid
	left join team e on a.teamid = e.id
	left join category f on a.categoryid = f.id
	left join priority g on a.priorityid = g.id
    left join user h on a.lastUpdateByUserid = h.id
    left join filestorage i on a.customFilename = i.customFilename
where a.ticketid = in_id
),

_ticket_sla as(
select 	a.ticketid as ticketid,

		-- creator id + fullname
		a.creator as creator,
        
		a.creatorPhone as creatorPhone,
		a.creatorEmail as creatorEmail,
		a.subject as subject,
		a.content as content,
        
        -- team id + team name + assignment method
		a.team as team,
		-- 2023-03-29 10:40:00
		a.createDatetime as createDatetime,
        -- 2023-03-29 11:00:00
		a.lastUpdateDatetime as lastUpdateDatetime,
		a.lastUpdateByUserid as lastUpdateByUserid,
        -- user id + fullname
        a.lastUpdateByUser as lastUpdateByUser,
        -- count spent hours. ex: spentHour = 1.3 (hours)
        a.spentHour as spentHour,
		-- count spent 'days-hours-minutes'. ex: spentDayHhmm = '3 days 15 hours 22 minutes'
        a.spentDayHhmm as spentDayHhmm,

        a.priorityid as priorityid,
        a.priority as priority,
        
		a.categoryid as categoryid,
        a.category as category,
        
        a.assigneeid as assigneeid,
        a.assignee as assignee,
        
		a.ticketStatusid as ticketStatusid,
        a.ticketStatus as ticketStatus,
        
		-- customFilename = yyyyMMddHHmmss + UUID + file extension
        -- ex: 20230413161647_f1f239a9-6fed-48ff-a84b-43cea7ffde88.jpg
		a.customFilename as customFilename,
        -- ex: abc.jpg
        a.originalFilename as originalFilename,
		--  
		-- limit hours need to resolve the ticket
		a.resolveIn,
        a.currentDatetime,
		case
			-- resolveIn = 0: means all tickets are on time
			when a.resolveIn = 0 then 'Ontime'
			when a.resolveIn < a.spentHour then 'Late'
			else 'Ontime'
		end as sla
from _ticket_spentHour a
)

-- call sp_getTicketById(101)

--
-- main select
--
select 	a.ticketid as ticketid,

		-- creator id + fullname
		a.creator as creator, 
        
		a.creatorPhone as creatorPhone,
		a.creatorEmail as creatorEmail,
		a.subject as subject,
		a.content as content,
        
		-- team id + team name + assignment method
		a.team as team,
        -- 2023-03-29 10:40:00
		a.createDatetime as createDatetime,
        -- 2023-03-29 11:00:00
		a.lastUpdateDatetime as lastUpdateDatetime,
        -- user id + fullname
        a.lastUpdateByUser as lastUpdateByUser,
        -- ex: "0 hour 24 minutes  --> Ontime"
        concat(a.spentDayHhmm,' --> ', a.sla) as spentHour,
        
        a.priorityid as priorityid,
        a.priority as priority,
        
		a.categoryid as categoryid,
        a.category as category,
        
        a.assigneeid as assigneeid,
        a.assignee as assignee,
        
		a.ticketStatusid as ticketStatusid,
        a.ticketStatus as ticketStatus,
        
		-- customFilename = yyyyMMddHHmmss + UUID + file extension
        -- ex: 20230413161647_f1f239a9-6fed-48ff-a84b-43cea7ffde88.jpg
        a.customFilename,
        -- abc.jpg
        a.originalFilename,        
		a.currentDatetime,
		a.resolveIn as resolveIn,
        a.sla as sla,
        -- ex: spentDayHhmm = '3 days 15 hours 22 minutes'
        a.spentDayHhmm as spentDayHhmm
from _ticket_sla a;

    
end $$

-- call sp_getTicketById(101)

delimiter ;

