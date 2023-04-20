use helpdesk;

-- drop procedure "sp_getTotalOfSla" if it exists
drop procedure if exists sp_getTotalOfSla;

delimiter $$

-- -----------------------------------------------------
-- Get 'total of SLA' by user id, user role and based on filter criteria.
-- This 'total of SLA' value helps for pagination.
--
-- Input parameters:
--
-- 	- in_userid: user id
--
-- 	- in_fromDate: from date(default = first day of current month)
-- 	- in_toDate: to date(current date)
-- 	- in_teamid: team id(a team may have 1 or multi supporters)
-- -----------------------------------------------------

-- customer: 	call sp_getTotalOfSla(1,'2023-04-01','2023-04-19','0')
-- customer: 	call sp_getTotalOfSla(1,'2023-04-20','2023-04-20','0')

create procedure sp_getTotalOfSla(in_userid int, 
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
		-- priority id + priority name
		concat(a.priorityid,' - ', a.priorityName) as priority,
        -- team id + team name
		concat(a.teamid, ' - ', a.teamName) as team,
        -- number of tickets from fromDate to toDate and based on [priorityid, teamid]
        count(a.ticketid) as numOfTickets,
        -- number of ontime tickets from fromDate to toDate and based on [priorityid, teamid]
        count(
			case
				when a.sla = 'Ontime' then '1'
                else null
            end
        ) as numOfOntimeTickets,
        -- number of lated tickets from fromDate to toDate and based on [priorityid, teamid]
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

-- get total of records
select 	count(a.priority) as totalOfSla
from _main a;


end $$



delimiter ;

