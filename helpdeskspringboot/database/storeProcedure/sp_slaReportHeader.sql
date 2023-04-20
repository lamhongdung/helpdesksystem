use helpdesk;

-- drop procedure "sp_slaReportHeader" if it exists
drop procedure if exists sp_slaReportHeader;

delimiter $$

-- -----------------------------------------------------
-- Get 'Sla report header' by user id, user role and based on filter criteria.
--
-- This store procedure is used for 'Sls report header' line in "SLA report" screen.
--
-- Input parameters:
--
-- 	- in_userid: user id
--
-- 	- in_fromDate: from date(default = first day of current month)
-- 	- in_toDate: to date(current date)
-- 	- in_teamid: team id(a team may have 1 or multi supporters)
-- -----------------------------------------------------

-- customer: 	call sp_slaReportHeader(1,'2023-04-01','2023-04-19','0')
-- customer: 	call sp_slaReportHeader(1,'2023-04-20','2023-04-20','0')

-- supporter: 	call sp_slaReportHeader(10,'2023-04-01','2023-04-19','0')

-- admin: 		call sp_slaReportHeader(20,'2023-04-01','2023-04-19','0')


create procedure sp_slaReportHeader(in_userid int, 
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
select 	
		-- total of tickets from fromDate to toDate and based on team criteria
        count(a.ticketid) as numOfTickets,
        -- total of ontime tickets from fromDate to toDate and based on team criteria 
        count(
			case
				when a.sla = 'Ontime' then '1'
                else null
            end
        ) as numOfOntimeTickets,
        -- total of lated tickets from fromDate to toDate and based on team criteria 
        count(
			case
				when a.sla = 'Late' then '1'
                else null
            end
        ) as numOfLatedTickets       
from _searchTicketTbl a
)

--
-- main select
-- 
select 	-- total of tickets from fromDate to toDate and based on team criteria 
		a.numOfTickets,
        -- total of ontime tickets from fromDate to toDate and based on team criteria 
        a.numOfOntimeTickets,
        -- total of lated tickets from fromDate to toDate and based on team criteria 
        a.numOfLatedTickets,
        -- SLA percentage
        case
			-- avoid error "divided by zero"
			when a.numOfTickets = 0 then 0
            else (a.numOfOntimeTickets*1.0)/a.numOfTickets
        end as slaPercent
from _main a;


end $$

-- customer: 	call sp_slaReportHeader(1,'2023-04-01','2023-04-19','0')
-- customer: 	call sp_slaReportHeader(1,'2023-04-20','2023-04-20','0')

-- supporter: 	call sp_slaReportHeader(10,'2023-04-01','2023-04-19','0')

-- admin: 		call sp_slaReportHeader(20,'2023-04-01','2023-04-19','0')

delimiter ;

