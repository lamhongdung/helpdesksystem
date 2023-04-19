use helpdesk;

-- drop procedure if it exists
drop procedure if exists sp_workloadReport;

delimiter $$

-- -----------------------------------------------------
-- generate 'workload report' based on filter criteria for 'Workload report' screen
--
-- Input parameters:
--
-- 	- in_pageNumber: page n-th nummber
-- 	- in_pageSize: number of lines of each page
-- 	- in_fromDate: from date
-- 	- in_toDate: to date
-- 	- in_teamid: team id(a team may have 1 or multi-supporters).
-- 		=0: means all teams
-- 	- in_supporterid: supporter id.
-- 		=0: means all supporters
-- -----------------------------------------------------

-- call sp_workloadReport(0, 5, '2023-04-18','2023-04-18','0','0')
-- call sp_workloadReport(0, 5, '2023-04-19','2023-04-19','0','0')
-- call sp_workloadReport(0, 5, '2023-04-18','2023-04-19','0','0')

create procedure sp_workloadReport(in_pageNumber int, 
									in_pageSize int,
									in_fromDate varchar(255),
									in_toDate varchar(255),
									in_teamid varchar(255),
									in_supporterid varchar(255)
									)
begin

-- create temporary "_workload" table
-- _workload = [teamid, teamStatus, supporterid, supporterStatus, createDate, numOfTickets]
call sp_workload(in_fromDate, in_toDate);
                        
-- drop temporary "_workload_filter" table if it exists
drop temporary table if exists _workload_filter;

-- create temporary "_workload_filter" table based on filter criteria(teamid and supporterid),
-- and only get active teams.
-- 
-- "_workload_filter" = [teamid, teamStatus, supporterid, supporterStatus, createDate, numOfTickets]
-- 
create temporary table _workload_filter
SELECT 	a.teamid, a.teamStatus, a.supporterid, a.supporterStatus, a.createDate, a.numOfTickets
FROM _workload a
where 	a.teamStatus = 'Active' and
        -- team
        case
			-- in_teamid = '0': means view all teams
			when in_teamid = '0' then true
            else teamid = in_teamid
        end and
        
		-- supporter
        case
			-- in_supporterid = '0': means view all supporters
			when in_supporterid = '0' then true
            else supporterid = in_supporterid
        end;

-- drop the temporary "_main" table if it exists
drop temporary table if exists _main;

-- create temporary "_main"
create temporary table _main
select 	
		-- team
        concat(a.teamid, ' - ', coalesce(b.name), ' - ',
				case coalesce(b.assignmentmethod,'')
					when 'A' then 'Auto'
					else 'Manual'
				end) as team,
		-- supporter = id + fullname
		concat(a.supporterid, ' - ', coalesce(c.lastName), ' ', coalesce(c.firstName)) as supporter,
        a.supporterStatus,
        a.numOfTickets
from _workload_filter a
	left join team b on a.teamid = b.id
    -- supporter
    left join user c on a.supporterid = c.id;

--
-- main select
--

select 	-- team id + name + assignmentMethod
		a.team,
		-- supporter id + fullname
		a.supporter,
        -- Active / Inactive
        a.supporterStatus,
        -- total of tickets of each [teamid, supporterid]
        sum(a.numOfTickets) as numOfTickets
from _main a
group by a.team, a.supporter, a.supporterStatus
order by a.team asc, a.supporterStatus asc, sum(a.numOfTickets) asc, a.supporter asc
-- only 1 page with 5 elements
limit in_pageNumber, in_pageSize;
    
end $$

-- call sp_workloadReport(0, 5, '2023-04-18','2023-04-18','0','0')
-- call sp_workloadReport(0, 5, '2023-04-19','2023-04-19','0','0')
-- call sp_workloadReport(0, 5, '2023-04-18','2023-04-19','0','0')

delimiter ;

