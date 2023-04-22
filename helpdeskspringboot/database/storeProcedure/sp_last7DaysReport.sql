use helpdesk;

-- drop procedure "sp_last7DaysReport" if it exists
drop procedure if exists sp_last7DaysReport;

delimiter $$

-- -----------------------------------------------------
-- Get "new tickets last 7 days" by user id, user role.
--
--
-- Input parameters:
--
-- 	- in_userid: user id
--
-- 	- in_reportDate: report date(default = current date).
-- 		if (report date = '') then consider 'report date' = current date.
-- -----------------------------------------------------

-- customer: 	call sp_last7DaysReport(1,'2023-04-22')
-- customer: 	call sp_last7DaysReport(1,'')

-- supporter: 	call sp_last7DaysReport(10,'2023-04-21')
-- supporter: 	call sp_last7DaysReport(10,'')

-- admin: 		call sp_last7DaysReport(20,'2023-04-21')
-- admin: 		call sp_last7DaysReport(20,'')


create procedure sp_last7DaysReport(in_userid int, 
									in_reportDate varchar(255)
									)
begin

-- last 7 dates
declare reportDate date;
-- reportDate_1 = reportDate - 1
declare reportDate_1 date;
-- reportDate_2 = reportDate - 2
declare reportDate_2 date;
-- reportDate_3 = reportDate - 3
declare reportDate_3 date;
-- reportDate_4 = reportDate - 4
declare reportDate_4 date;
-- reportDate_5 = reportDate - 5
declare reportDate_5 date;
-- reportDate_6 = reportDate - 6
declare reportDate_6 date;

-- if (in_reportDate = '') then consider 'reportDate' = current date.
if (in_reportDate = '') then
	-- reportDate = (current date)
	set reportDate = cast(curdate() as date);
else
	set reportDate = cast(in_reportDate as date);
end if;

-- reportDate_1 = reportDate - 1
set reportDate_1 = date_sub(reportDate, interval 1 day);
-- reportDate_2 = reportDate - 2
set reportDate_2 = date_sub(reportDate, interval 2 day);
-- reportDate_3 = reportDate - 3
set reportDate_3 = date_sub(reportDate, interval 3 day);
-- reportDate_4 = reportDate - 4
set reportDate_4 = date_sub(reportDate, interval 4 day);
-- reportDate_5 = reportDate - 5
set reportDate_5 = date_sub(reportDate, interval 5 day);
-- reportDate_6 = reportDate - 6
set reportDate_6 = date_sub(reportDate, interval 6 day);

-- create temporary "_searchTicketTbl" table contains tickets by user id, user role
-- and by reportDate
call sp_searchTicketTbl(in_userid, 
						'', -- in_searchTerm = '': means any searchTerm
                        reportDate_6, -- from date
                        in_reportDate, -- in_toDate
                        '0', -- in_categoryid = '0': means all categories
						'0', -- in_priorityid = '0': means all priorities
                        '0', -- in_creatorid = '0': means all creators
                        '0', -- in_teamid = '0': means all teams
                        '0', -- in_assigneeid = '0': means all assignees
                        '', -- in_sla = '': means all SLAs
						'0' -- in_ticketStatusid = '0': means all ticket status
                        );

-- drop the temporary '_last7DaysTicket' table if it exists
drop temporary table if exists _last7DaysTicket;

-- create temporary '_last7DaysTicket'.
-- This '_last7DaysTicket' table contains 'number of new tickets', 'number of solved tickets',
-- 'number of closed tickets', and 'total spent hours' for 'Resolved'/'Closed' tickets.
create temporary table _last7DaysTicket
select	-- ex: 2023-04-21
		cast(a.createDatetime as date) as createDate,
        
        -- number of new tickets last 7 days('reportDate_6' to 'reportDate')
		count(a.ticketid) as numOfNewTickets,
        
        -- number of solved tickets last 7 days('reportDate_6' to 'reportDate')
        count(
			case
				-- if (ticket status = 'Resolved'(3)) then count it
				when a.ticketStatusid = 3 then '1'
                -- mysql will not count null lines
                else null
            end
        ) as numOfSolvedTickets,
        
        -- number of closed tickets last 7 days('reportDate_6' to 'reportDate')
		count(
			case
				-- if (ticket status = 'Closed'(4)) then count it
				when a.ticketStatusid = 4 then '1'
                -- mysql will not count null lines
                else null
            end
        ) as numOfClosedTickets,
        
        -- total of spent hours for 'Resolved'/'Closed' tickets
		sum(
			case
				-- if 'ticket status' = 'Resolved'(3)/'Closed'(4) then count spent hour
				when (a.ticketStatusid = 3 or a.ticketStatusid = 4) then a.spentHour
                -- other ticket status is not count
                else 0
            end
        ) as totalSpentHour
from _searchTicketTbl a
group by cast(a.createDatetime as date);

with
-- create temporary '_last7Days' table. This temporary table contains '7 dates'
_last7Days as
(
select reportDate as reportDate
union all
select reportDate_1 as reportDate
union all
select reportDate_2 as reportDate
union all
select reportDate_3 as reportDate
union all
select reportDate_4 as reportDate
union all
select reportDate_5 as reportDate
union all
select reportDate_6 as reportDate
),

-- create temporary '_last7Days_numOfTickets' table.
-- This temporary '_last7Days_numOfTickets' table contains 'number of new tickets' last 7 days.
_last7Days_numOfTickets as(
select	-- day + month. ex: 21/04
		concat(day(a.reportDate),'/',month(a.reportDate)) as dayMonth,
        -- week days(Mon, Tue, Wed, Thu, Fri, Sat, Sun)
		case
			-- monday
			when weekday(a.reportDate) = 0 then 'Mon'
            -- tuesday
            when weekday(a.reportDate) = 1 then 'Tue'
            -- wednesday
            when weekday(a.reportDate) = 2 then 'Wed'
            -- thursday
            when weekday(a.reportDate) = 3 then 'Thu'
            -- friday
            when weekday(a.reportDate) = 4 then 'Fri'
            -- saturday
            when weekday(a.reportDate) = 5 then 'Sat'
            -- sunday
            else 'Sun'
        end as weekday,
        -- number of new tickets last 7 days by user id and by user role
		coalesce(b.numOfNewTickets, 0) as numOfNewTickets,
        -- number of solved tickets last 7 days by user id and by user role
        coalesce(b.numOfSolvedTickets, 0) as numOfSolvedTickets,
        -- number of closed tickets last 7 days by user id and by user role
        coalesce(b.numOfClosedTickets, 0) as numOfClosedTickets,
        -- total spent hours for 'Resolved'/'Closed' tickets
        coalesce(b.totalSpentHour, 0) as totalSpentHour
from _last7Days a
	 left join _last7DaysTicket b on a.reportDate = b.createDate
order by a.reportDate asc
)

--
-- main select
--
select	-- weekday + day + month. ex: 'Fri-21/4'
		concat(a.weekday, '-', a.dayMonth) as dayMonth,
        -- number of new tickets on this date 'dayMonth'
		a.numOfNewTickets as numOfNewTickets,
        -- number of solved tickets on this date 'dayMonth'
        a.numOfSolvedTickets as numOfSolvedTickets,
        -- number of closed tickets on this date 'dayMonth'
        a.numOfClosedTickets as numOfClosedTickets,
        -- total spent hours for 'Resolved'/'Closed' tickets
        a.totalSpentHour as totalSpentHour
from _last7Days_numOfTickets a;


end $$

-- customer: 	call sp_last7DaysReport(1,'2023-04-21')
-- customer: 	call sp_last7DaysReport(1,'')

-- supporter: 	call sp_last7DaysReport(10,'2023-04-21')
-- supporter: 	call sp_last7DaysReport(10,'')

-- admin: 		call sp_last7DaysReport(20,'2023-04-21')
-- admin: 		call sp_last7DaysReport(20,'')

delimiter ;

