use helpdesk;

-- drop procedure if it exists
drop procedure if exists sp_workloadReport;

delimiter $$

-- -----------------------------------------------------
-- generate 'workload report' based on filter criteria
--
-- Input parameters:
--
-- 	- in_fromDate: from date(default = current date)
-- 	- in_toDate: to date(default = current date)
-- 	- in_teamid: team id(a team may have 1 or multi-supporters)
-- 	- in_supporterid: supporter id
-- -----------------------------------------------------

-- call sp_workloadReport(0, 5, '2023-04-18','2023-04-18','0','0')

create procedure sp_workloadReport(in_pageNumber int, 
									in_pageSize int,
									in_fromDate varchar(255),
									in_toDate varchar(255),
									in_teamid varchar(255),
									in_supporterid varchar(255)
									)
begin

-- drop the temporary "_ticket" table if it exists
drop temporary table if exists _ticket;

-- create temporary "_ticket" table based on filter criteria
create temporary table _ticket
SELECT a.*
FROM ticket a
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
				-- convert datetime to date
				cast(a.createDatetime as Date) <= in_toDate
            else true
        end and
        
        -- team
        case
			-- in_teamid = '0': means search all teams
			when in_teamid = '0' then true
            else teamid = in_teamid
        end and
        
		-- supporter
        case
			-- in_supporterid = '0': means search all supporters
			when in_supporterid = '0' then true
            else assigneeid = in_supporterid
        end;
 
-- drop the temporary "_ticket_numOfTickets" table if it exists
drop temporary table if exists _ticket_numOfTickets;

-- create temporary "_ticket_numOfTickets"
create temporary table _ticket_numOfTickets
select 	a.teamid as teamid,
        coalesce(a.assigneeid,-1) as assigneeid,
        count(coalesce(a.assigneeid,-1)) as numOfTickets
from _ticket a
group by a.teamid, coalesce(a.assigneeid,-1);

-- drop the temporary "_main" table if it exists
drop temporary table if exists _main;

-- create temporary "_main"
create temporary table _main
select 	concat(a.teamid, ' - ', coalesce(b.name), ' - ',
				case coalesce(b.assignmentmethod,'')
					when 'A' then 'Auto'
					else 'Manual'
				end) as team, 
		concat(a.assigneeid, ' - ', coalesce(c.lastName), ' ', coalesce(c.firstName),
				case coalesce(c.status,'')
					when '' then ''
					else concat(' - ',coalesce(c.status,''))
				end) as supporter,
        a.numOfTickets
from _ticket_numOfTickets a
	left join team b on a.teamid = b.id
    -- supporter
    left join user c on a.assigneeid = c.id and c.role = 'ROLE_SUPPORTER';

--
-- main select
--
select a.*
from _main a
order by a.team asc, a.numOfTickets asc
-- only 1 page with 5 elements
limit in_pageNumber, in_pageSize;
    
end $$



delimiter ;

