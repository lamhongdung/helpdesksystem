use helpdesk;

-- drop procedure "sp_slaReportDetail" if it exists
drop procedure if exists sp_slaReportDetail;

delimiter $$

-- -----------------------------------------------------
-- Get 'Sla report detail' by user id, user role and based on search criteria.
--
-- This store procedure is used for 'Sls report detail' table in "SLA report" screen.
--
-- Input parameters:
--
-- 	- in_userid: user id
--
-- 	- in_pageNumber: page number(0,1,2,...)
-- 	- in_pageSize: page size(default = 5)
--
-- 	- in_fromDate: from date(default = first day of current month)
-- 	- in_toDate: to date(current date)
-- 	- in_teamid: team id(a team may have 1 or multi supporters)
-- -----------------------------------------------------

-- customer: 	call sp_slaReportDetail(1,0,5,'2023-04-01','2023-04-19','0')
-- customer: 	call sp_slaReportDetail(1,0,5,'2023-04-20','2023-04-20','0')

-- supporter: 	call sp_slaReportDetail(10,0,5,'2023-04-01','2023-04-19','0')

-- admin: 		call sp_slaReportDetail(20,0,5,'2023-04-01','2023-04-19','0')


create procedure sp_slaReportDetail(in_userid int, 
									in_pageNumber int, 
									in_pageSize int,
									in_fromDate varchar(255),
									in_toDate varchar(255),
									in_teamid varchar(255)
									)
begin

-- create temporary "_searchTicketTbl" table contains tickets by user id, user role
-- and by fromDate, toDate, Team
call sp_searchTicketTbl(in_userid, 
						'', -- in_searchTerm = '': means all searchTerm
                        in_fromDate, in_toDate, 
                        '0', -- in_categoryid = '0': means all categories
						'0', -- in_priorityid = '0': means all priorities
                        '0', -- in_creatorid = '0': means all creators
                        in_teamid, 
                        '0', -- in_assigneeid = '0': means all assignees
                        '', -- in_sla = '': means all SLAs
						'0' -- in_ticketStatusid = '0': means all ticket status
                        );
with _main as
(
select 	-- priority id + priority name
		concat(a.priorityid,' - ', a.priorityName) as priority,
        -- team id + team name
		concat(a.teamid, ' - ', a.teamName) as team,
        -- number of tickets based on [priorityid, teamid] 
        count(a.ticketid) as numOfTickets,
        -- number of ontime tickets based on [priorityid, teamid] 
        count(
			case
				when a.sla = 'Ontime' then '1'
                else null
            end
        ) as numOfOntimeTickets,
        -- number of lated tickets based on [priorityid, teamid] 
        count(
			case
				when a.sla = 'Late' then '1'
                else null
            end
        ) as numOfLatedTickets       
from _searchTicketTbl a
group by 	concat(a.priorityid,' - ', a.priorityName),
			concat(a.teamid, ' - ', a.teamName)
)

--
-- main select
--
select 	a.priority,
		a.team,
        -- number of tickets based on [priorityid, teamid] 
        a.numOfTickets,
        -- number of ontime tickets based on [priorityid, teamid] 
        a.numOfOntimeTickets,
        -- number of lated tickets based on [priorityid, teamid] 
        a.numOfLatedTickets,
        -- SLA percentage
        case
			-- avoid error of "divided by zero"
			when a.numOfTickets = 0 then 0
            else (a.numOfOntimeTickets*1.0)/a.numOfTickets
        end as slaPercent
from _main a
order by a.priority, a.team
limit in_pageNumber, in_pageSize;


end $$



delimiter ;

