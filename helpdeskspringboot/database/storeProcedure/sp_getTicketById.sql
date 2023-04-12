use helpdesk;

-- drop procedure if it exists
drop procedure if exists sp_getTicketById;

delimiter $$

-- -----------------------------------------------------
-- get ticket by ticket id for edit/view ticket
--
-- Input parameters:
--
-- 	- in_id: ticket id
-- -----------------------------------------------------

-- call sp_getTicketById(4)

create procedure sp_getTicketById(
									in_id int
									)
begin

-- drop the temporary "_ticketTbl_spentHour" table if it exists
drop temporary table if exists _ticketTbl_spentHour;

-- create temporary "_ticketTbl_spentHour"
create temporary table _ticketTbl_spentHour
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
				when coalesce(e.assignmentMethod,'') = 'A' then 'Auto'
                else 'Manual'
            end
        ) as team,
		-- 2023-03-29 10:40:00
		a.createDatetime as createDatetime,
        -- 2023-03-29 11:00:00
		a.lastUpdateDatetime as lastUpdateDatetime,
		a.lastupdatebyuserid as lastupdatebyuserid,
        concat(a.lastupdatebyuserid, ' - ', 
			coalesce(h.lastName,''),' ',coalesce(h.firstName,'')) as lastUpdateByUser,
        -- count spent hours of ticket in hh:mm:ss format
		case
			-- if status is "Closed"(4) or "Cancel"(5) then (a.lastUpdateDatetime - a.createDatetime)
			when (coalesce(d.statusid,0) = 4 or coalesce(d.statusid,0) = 5) then
				-- number of hours between createDatetime and lastUpdateDatetime in format HH:mm:ss
                -- ex: sec_to_time(3600) = 01:00:00
				sec_to_time(timestampdiff(second, a.createDatetime, a.lastUpdateDatetime))
                
			-- else: (current date time - a.createDatetime)
			else 
				-- number of hours between createDatetime and now() in format HH:mm:ss
                -- ex: sec_to_time(3600) = 01:00:00            
				sec_to_time(timestampdiff(second, a.createDatetime, now()))
		end as spentHourHhmmss,        
		a.categoryid as categoryid,
        a.priorityid as priorityid,
        coalesce(a.assigneeid, -1) as assigneeid,
		a.ticketStatusid as ticketStatusid,
        
		a.customFilename as customFilename,
        coalesce(i.originalFilename,'') as originalFilename,

		--  
		-- limit hours need to resolve the ticket
		coalesce(g.resolveIn, 0) as resolveIn,
        now() as currentDatetime,
        -- count spent hours of ticket. note: 1 hour = 3600 seconds.
		case
			-- if status is "Closed"(4) or "Cancel"(5) then (a.lastUpdateDatetime - a.createDatetime)
			when (coalesce(d.statusid,0) = 4 or coalesce(d.statusid,0) = 5) then
				-- number of hours between createDatetime and lastUpdateDatetime
				timestampdiff(second, a.createDatetime, a.lastUpdateDatetime)/3600.0
                
			-- else: (current date time - a.createDatetime)
			else 
				-- number of hours between createDatetime and now()
				timestampdiff(second, a.createDatetime, now())/3600.0
		end as spentHour
from ticket a
	-- creator
	left join user b on a.creatorid = b.id
	-- assignee
	left join user c on coalesce(a.assigneeid,-1) = c.id
	left join ticketStatus d on a.ticketStatusid = d.statusid
	left join team e on a.teamid = e.id
	left join category f on a.categoryid = f.id
	left join priority g on a.priorityid = g.id
    left join user h on a.lastupdatebyuserid = h.id
    left join filestorage i on a.customFilename = i.customFilename
where a.ticketid = in_id;

-- drop the temporary "_ticketTbl_sla" table if it exists
drop temporary table if exists _ticketTbl_sla;

-- create temporary "_ticketTbl_sla"
create temporary table _ticketTbl_sla
select 	a.ticketid as ticketid,
		a.creator as creator, 
		a.creatorPhone as creatorPhone,
		a.creatorEmail as creatorEmail,
		a.subject as subject,
		a.content as content,
        
		a.team as team,
		a.createDatetime as createDatetime,                
		a.lastUpdateDatetime as lastUpdateDatetime,
        a.lastUpdateByUser as lastUpdateByUser,
        a.spentHourHhmmss,
        a.categoryid as categoryid,
        a.priorityid as priorityid,        
        a.assigneeid as assigneeid,
		a.ticketStatusid as ticketStatusid,
        a.customFilename,
        a.originalFilename,        
        --
        --
        --
		a.resolveIn as resolveIn,
        case
			-- resolveIn = 0: means all tickets are on time
			when a.resolveIn = 0 then 'Ontime'
            when a.resolveIn < a.spentHour then 'Late'
            else 'Ontime'
        end as sla,
        a.currentDatetime
from _ticketTbl_spentHour a;

--
-- main select
--
select 	a.ticketid as ticketid,
		a.creator as creator, 
		a.creatorPhone as creatorPhone,
		a.creatorEmail as creatorEmail,
		a.subject as subject,
		a.content as content,
        
		a.team as team,
		a.createDatetime as createDatetime,                
		a.lastUpdateDatetime as lastUpdateDatetime,
        a.lastUpdateByUser as lastUpdateByUser,
        concat(a.spentHourHhmmss,' --> ', a.sla) as spentHour,
        a.categoryid as categoryid,
        a.priorityid as priorityid,        
        a.assigneeid as assigneeid,
		a.ticketStatusid as ticketStatusid,
        a.customFilename,
        a.originalFilename,        
        --
        --
        --
		a.currentDatetime,
		a.resolveIn as resolveIn,
        a.sla as sla
from _ticketTbl_sla a;

    
end $$

-- call sp_getTicketById(1)

delimiter ;

