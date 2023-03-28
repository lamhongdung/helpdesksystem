use helpdesk;

-- drop procedure if it exists
drop procedure if exists sp_searchTicketTbl;

delimiter $$

-- -----------------------------------------------------
-- create temporary "searchTicketTbl" table which contains
-- tickets based on search conditions(and based on user id, user role as well).
--
-- Input parameters:
--
-- 	- in_userid: user id,
-- 	- in_searchTerm: search term,
-- 	- in_fromDate: from date(default = first day of current year),
-- 	- in_toDate: to date(current date),
-- 	- in_categoryid: category id,
-- 	- in_priorityid: priority id,
-- 	- in_creatorid: creator id(who created ticket),
-- 	- in_teamid: team id(a team has multi-supporters),
-- 	- in_assignee: assignee is person will resove the ticket,
-- 	- in_sla: service level agreement. Check whether a certain ticket is on time or late,
-- 	- in_ticketStatusid: ticket status id(has 5 status: Open, Cancel, Assigned, Resolved, Closed)
-- -----------------------------------------------------

-- customer: 	call sp_searchTicketTbl(1,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')
-- customer: 	call sp_searchTicketTbl(1,'','','2023-03-26','0','0','1','0','0','','0')
-- customer: 	call sp_searchTicketTbl(1,'','','2023-03-20','0','0','1','0','0','','0')
-- customer: 	call sp_searchTicketTbl(1,'','2023-01-01','2023-03-26','1','0','1','0','0','','0')

-- supporter: 	call sp_searchTicketTbl(10,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')
-- admin: 		call sp_searchTicketTbl(20,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')

create procedure sp_searchTicketTbl(in_userid int, 
									in_searchTerm varchar(2000),
									in_fromDate varchar(255),
									in_toDate varchar(255),
									in_categoryid varchar(255),
									in_priorityid varchar(255),
									in_creatorid varchar(255),
									in_teamid varchar(255),
									in_assigneeid varchar(255),
									in_sla varchar(255),
									in_ticketStatusid varchar(255)
									)
begin

-- user role
declare userRole varchar(255);

-- create temporary "ticketTbl" table contains tickets by user id and by user role
call sp_ticketTbl(in_userid);

-- get user role by user id
set userRole = (select a.role 
				from user a
				where a.id = in_userid
				);

--
-- search tickets based on searchTerm of each user role
--

-- drop the temporary "ticketTbl_searchTerm" table if it exists
drop temporary table if exists ticketTbl_searchTerm;
    
-- role "customer"
if userRole = "ROLE_CUSTOMER" then

	-- create temporary "ticketTbl_searchTerm" based on "in_searchTerm"
	create temporary table ticketTbl_searchTerm
	SELECT a.*
	FROM ticketTbl a
	where concat(a.ticketid,' ', a.subject,' ', a.content) like concat('%',in_searchTerm,'%');
	
-- role "supporter" or "admin"
else

	-- create temporary "ticketTbl_searchTerm" based on "in_searchTerm"
	create temporary table ticketTbl_searchTerm
	SELECT a.*
	FROM ticketTbl a
		left join user b on a.creatorid = b.id
	where concat(a.ticketid,' ', a.subject,' ', a.content,' ', 
					coalesce(b.phone,''), ' ',coalesce(b.email,'')
				) like concat('%',in_searchTerm,'%');
	
end if;

-- drop the temporary "ticketTbl_allParameters_withoutSLA" table if it exists
drop temporary table if exists ticketTbl_allParameters_withoutSLA;

-- create temporary "ticketTbl_allParameters_withoutSLA" based on all criterias except SLA
create temporary table ticketTbl_allParameters_withoutSLA
SELECT a.*
FROM ticketTbl_searchTerm a
where 	
		-- fromDate
        case
			when in_fromDate <> '' then a.createDatetime >= in_fromDate
            else true
		end and
        
        -- toDate
        case
			when in_toDate <> '' then a.createDatetime <= in_toDate
            else true
        end and
        
        -- category
        case
			when in_categoryid = '0' then true
            else categoryid = in_categoryid
        end and
        
		-- priority
        case
			when in_priorityid = '0' then true
            else priorityid = in_priorityid
        end and
        
		-- creator.
        -- note: if role = 'customer' then creatorid = hime-self always
        case
			when in_creatorid = '0' then true
            else creatorid = in_creatorid
        end and
        
		-- team
        case
			when in_teamid = '0' then true
            else teamid = in_teamid
        end and
        
		-- assignee
        case
			when in_assigneeid = '0' then true
            when in_assigneeid = '-1' then assigneeid is null
            else assigneeid = in_assigneeid
        end and
        
        -- ticketStatusid
		case
			when in_ticketStatusid = '0' then true
            else ticketStatusid = in_ticketStatusid
        end;

-- drop the temporary "ticketTbl_spendHour" table if it exists
drop temporary table if exists ticketTbl_spendHour;

-- create temporary "ticketTbl_spendHour"
create temporary table ticketTbl_spendHour
select 	a.ticketid as ticketid, 
		a.subject as subject,
		concat(coalesce(b.lastName,''),' ',coalesce(b.firstName,'')) as creatorName,
		concat(coalesce(c.lastName,''),' ',coalesce(c.firstName,'')) as assigneeName,
		a.createDatetime as createDatetime,
		coalesce(d.name,'') as ticketStatusName,
		coalesce(b.phone,'') as creatorPhone,
		coalesce(b.email,'') as creatorEmail,
		coalesce(e.name,'') as teamName,
		coalesce(f.name,'') as categoryName,
		-- priority + hours to resovle the ticket
		concat(coalesce(g.name,''),' - ', coalesce(g.resolveIn, 0),' hours') as priorityName,
		--  
		a.content as content,
		-- number of estimate hours need to resolve the ticket
		coalesce(g.resolveIn, 0) as resolveIn,
		a.lastUpdateDatetime as lastUpdateDatetime,
        now() as currentTime,
        -- count spend hours of ticket. note: 1 hour = 3600 seconds.
		case
			-- if status = "Closed" then "a.lastUpdateDatetime - a.createDatetime"
			when coalesce(d.statusid,0) = 5 then 
				timestampdiff(second, a.createDatetime, a.lastUpdateDatetime)/3600.0
                
			-- else: (current time - a.createDatetime)
			else timestampdiff(second, a.createDatetime, now())/3600.0
		end as spendHour
from ticketTbl_allParameters_withoutSLA a
	-- creator
	left join user b on a.creatorid = b.id
	-- assignee
	left join user c on coalesce(a.assigneeid,'') = c.id
	left join ticketStatus d on a.ticketStatusid = d.statusid
	left join team e on a.teamid = e.id
	left join category f on a.categoryid = f.id
	left join priority g on a.priorityid = g.id;    

-- drop the temporary "ticketTbl_sla" table if it exists
drop temporary table if exists ticketTbl_sla;

-- create temporary "ticketTbl_sla"
create temporary table ticketTbl_sla
select 	a.ticketid as ticketid, 
		a.subject as subject,
		a.creatorName as creatorName,
		a.assigneeName as assigneeName,
		a.createDatetime as createDatetime,
		a.ticketStatusName as ticketStatusName,
		a.creatorPhone as creatorPhone,
		a.creatorEmail as creatorEmail,
		a.teamName as teamName,
		a.categoryName as categoryName,
		a.priorityName as priorityName,
		a.content as content,
		a.resolveIn as resolveIn,
		a.lastUpdateDatetime as lastUpdateDatetime,
        a.spendHour as spendHour,
        case
			when a.resolveIn = 0 then 'Ontime'
            when a.resolveIn < a.spendHour then 'Late'
            else 'Ontime'
        end as sla,
        a.currentTime
from ticketTbl_spendHour a;

--
-- main select
--

-- drop the temporary "searchTicketTbl" table if exists
drop temporary table if exists searchTicketTbl;

-- create new temporary table "searchTicketTbl"
create temporary table searchTicketTbl(
	`ticketid` int,
	`subject` varchar(2000),
	`creatorName` varchar(255),
	`assigneeName` varchar(255),
	`createDatetime` datetime,
    `ticketStatusName` varchar(255),
    `sla` varchar(255),
    `lastUpdateDatetime` datetime,
	`spendHour` float,
	`creatorPhone` varchar(255),
	`creatorEmail` varchar(255),
	`teamName` varchar(255),
	`categoryName` varchar(255),
	`priorityName` varchar(255),
	`content` text,
    `resolveIn` int,
	`currentTime` datetime
);

-- create temporary "searchTicketTbl" table
insert into searchTicketTbl
select 	a.ticketid as ticketid, 
		a.subject as subject,
		a.creatorName as creatorName,
		a.assigneeName as assigneeName,
		a.createDatetime as createDatetime,
		a.ticketStatusName as ticketStatusName,
        a.sla as sla,	
		a.lastUpdateDatetime as lastUpdateDatetime,
		a.spendHour as spendHour,
		a.creatorPhone as creatorPhone,
		a.creatorEmail as creatorEmail,
		a.teamName as teamName,
		a.categoryName as categoryName,
		a.priorityName as priorityName,
		a.content as content,
		a.resolveIn as resolveIn,
        a.currentTime as currentTime
from ticketTbl_sla a
where
	case
		when in_sla = '' then true
        else sla = in_sla
    end;
    

end $$

-- customer: 	call sp_searchTicketTbl(1,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')
-- customer: 	call sp_searchTicketTbl(1,'','','2023-03-26','0','0','1','0','0','','0')
-- customer: 	call sp_searchTicketTbl(1,'','','2023-03-20','0','0','1','0','0','','0')
-- customer: 	call sp_searchTicketTbl(1,'','2023-01-01','2023-03-26','1','0','1','0','0','','0')

-- supporter: 	call sp_searchTicketTbl(10,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')
-- admin: 		call sp_searchTicketTbl(20,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')

delimiter ;

