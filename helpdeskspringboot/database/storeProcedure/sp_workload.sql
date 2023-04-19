use helpdesk;

-- drop procedure if it exists
drop procedure if exists sp_workload;

delimiter $$

-- -----------------------------------------------------
-- create '_workload' temporary table 
-- for generating 'workload report' and creating new ticket
-- (assign ticket to assignee who has at least workload).
--
-- this '_workload' temporary table contains number of tickets of each [team, supporter, date]
-- 
-- Input parameters:
--
-- 	- in_fromDate: from date
-- 	- in_toDate: to date
-- -----------------------------------------------------

-- call sp_workload('2023-04-18','2023-04-18')
-- call sp_workload('2023-04-19','2023-04-19')

create procedure sp_workload(in_fromDate varchar(255),
								in_toDate varchar(255)
								)
begin

-- drop the temporary "_workload" table if exists
drop temporary table if exists _workload;

-- create new temporary table "_workload"
create temporary table _workload(

	-- team id
	`teamid` int,
    -- Active / Inactive
    `teamStatus` varchar(255),
    -- supporter id
	`supporterid` int,
    -- Active / Inactive
    `supporterStatus` varchar(255),
    -- ex: 2023-04-19
	-- `createDate` date,
    `createDate` varchar(255),
    -- total of tickets of each date
	`numOfTickets` int
    
);

-- drop temporary "_ticket" table if it exists
drop temporary table if exists _ticket;

-- create temporary "_ticket" table contains tickets from in_fromDate to in_toDate
-- note: in_fromDate <= cast(a.createDatetime as Date) <= in_toDate
create temporary table _ticket
select 	a.*
from ticket a
where 	
	-- fromDate
	case
		-- when in_fromDate has value
		when in_fromDate <> '' then 
			-- convert datetime to date
			in_fromDate <= cast(a.createDatetime as Date)
		else true
	end and

	-- toDate
	case
		-- when in_toDate has value
		when in_toDate <> '' then
			-- convert datetime to date.
            -- note: must convert a.createDatetime to Date
			cast(a.createDatetime as Date) <= in_toDate
		else true
	end;

-- drop temporary "_teamSupporter_ticket" table if it exists
drop temporary table if exists _teamSupporter_ticket;

-- create temporary "_teamSupporter_ticket" table
create temporary table _teamSupporter_ticket
select 	a.teamid,
		-- Active / Inactive
		coalesce(c.status, '') as teamStatus,
		a.supporterid,
        -- Active / Inactive
        coalesce(d.status, '') as supporterStatus,
        -- mysql will not count 'null' lines
        coalesce(b.ticketid, null) as ticketid,
        -- only get date(not time). ex: 2023-04-19
        left(coalesce(b.createDatetime,''),10) as createDate
from teamSupporter a
	left join _ticket b on a.teamid = b.teamid and a.supporterid = coalesce(b.assigneeid,-1)
    left join team c on a.teamid = c.id
    left join user d on a.supporterid = d.id and d.role = 'ROLE_SUPPORTER';

-- 	
-- main insert
-- 

insert into _workload
select 	a.teamid,
		-- Active / Inactive
		a.teamStatus,
		a.supporterid,
        -- Active / Inactive
        a.supporterStatus,
        -- ex: 2023-04-19
        a.createDate,
        -- total of tickets of each [teamid, supporterid, createDate]
        count(a.ticketid) as numOfTickets
from _teamSupporter_ticket a
group by a.teamid, a.teamStatus, a.supporterid, a.supporterStatus, a.createDate;


end $$

-- call sp_workload('2023-04-18','2023-04-18')
-- call sp_workload('2023-04-19','2023-04-19')

delimiter ;

