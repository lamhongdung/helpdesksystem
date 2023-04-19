use helpdesk;

drop procedure if exists sp_getTotalOfWorkloads;

delimiter $$

-- -----------------------------------------------------
-- Get total of workloads based on filter criteria for pagination.
--
-- Input parameters:
--
-- 	- in_fromDate: from date
-- 	- in_toDate: to date
-- 	- in_teamid: team id(a team may have 1 or multi supporters).
-- 		=0: means all teams
-- 	- in_supporterid: supporter id
-- 		=0: means all supporters
-- -----------------------------------------------------

-- call sp_getTotalOfWorkloads('2023-04-18','2023-04-19','0','0')

create procedure sp_getTotalOfWorkloads(
    in_fromDate varchar(255),
    in_toDate varchar(255),
    in_teamid varchar(255),
	in_supporterid varchar(255))
begin

-- create temporary "_workload" table
-- _workload = [teamid, teamStatus, supporterid, supporterStatus, createDate, numOfTickets]
call sp_workload(in_fromDate, in_toDate);

-- drop the temporary "_workload_filter" table if it exists
drop temporary table if exists _workload_filter;

-- create temporary "_workload_filter" table based on filter criteria(teamid and supporterid),
-- and only get active teams.
-- 
-- _workload_filter = [teamid, teamStatus, supporterid, supporterStatus, createDate, numOfTickets]
-- 
create temporary table _workload_filter
select 	a.teamid, a.teamStatus, a.supporterid, a.supporterStatus, a.createDate, a.numOfTickets
from _workload a
where 	a.teamStatus = 'Active' and
        -- team
        case
			-- in_teamid = '0': means filter all teams
			when in_teamid = '0' then true
            else a.teamid = in_teamid
        end and
        
		-- supporter
        case
			-- in_supporterid = '0': means filter all supporters
			when in_supporterid = '0' then true
            else a.supporterid = in_supporterid
        end;
        
-- drop the temporary "_workload_info" table if it exists
drop temporary table if exists _workload_info;

-- create temporary "_workload_info"
create temporary table _workload_info
select 	
		-- team = id + name + assignment method
        concat(a.teamid, ' - ', coalesce(b.name), ' - ',
				case coalesce(b.assignmentmethod,'')
					when 'A' then 'Auto'
					else 'Manual'
				end) as team,
		-- supporter = id + fullname + status
		concat(a.supporterid, ' - ', coalesce(c.lastName), ' ', coalesce(c.firstName), ' - ',
				a.supporterStatus) as supporter,
        a.numOfTickets
from _workload_filter a
	left join team b on a.teamid = b.id
    -- supporter
    left join user c on a.supporterid = c.id;

-- drop the temporary "_main" table if it exists
drop temporary table if exists _main;

-- create temporary "_main"
create temporary table _main
select 	-- id + name + assignment method
		a.team,
        -- id + fullname + status
		a.supporter,
        -- total of tickets from in_fromDate to in_toDate of each [teamid, supporterid]
        sum(a.numOfTickets) as numOfTickets
from _workload_info a
group by a.team, a.supporter;
        
-- 
-- main select
-- 

-- get total of records for pagination
select count(a.team) as totalOfWorkloads
from _main a;

end $$

-- call sp_getTotalOfWorkloads('2023-04-18','2023-04-19','0','0')

delimiter ;