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
-- 	- in_reportDate: report date(default = current date)
-- -----------------------------------------------------

-- customer: 	call sp_last7DaysReport(1,'2023-04-21')

-- supporter: 	call sp_last7DaysReport(10,'2023-04-21')

-- admin: 		call sp_last7DaysReport(20,'2023-04-21')


create procedure sp_last7DaysReport(in_userid int, 
									in_reportDate varchar(255)
									)
begin

-- rep
declare reportDate date;
declare reportDate_1 date;
declare reportDate_2 date;
declare reportDate_3 date;
declare reportDate_4 date;
declare reportDate_5 date;
declare reportDate_6 date;

if (in_reportDate = '') then
	set reportDate = cast(curdate() as date);
else
	set reportDate = cast(in_reportDate as date);
end if;

set reportDate_1 = date_sub(reportDate, interval 1 day);
set reportDate_2 = date_sub(reportDate, interval 2 day);
set reportDate_3 = date_sub(reportDate, interval 3 day);
set reportDate_4 = date_sub(reportDate, interval 4 day);
set reportDate_5 = date_sub(reportDate, interval 5 day);
set reportDate_6 = date_sub(reportDate, interval 6 day);

-- create temporary "_searchTicketTbl" table contains tickets by user id, user role
-- and by reportDate
call sp_searchTicketTbl(in_userid, 
						'', -- in_searchTerm = '': means all searchTerm
                        reportDate_6,
                        in_reportDate, -- in_toDate
                        '0', -- in_categoryid = '0': means all categories
						'0', -- in_priorityid = '0': means all priorities
                        '0', -- in_creatorid = '0': means all creators
                        '0', -- in_teamid = '0': means all teams
                        '0', -- in_assigneeid = '0': means all assignees
                        '', -- in_sla = '': means all SLAs
						'0' -- in_ticketStatusid = '0': means all ticket status
                        );

-- drop the temporary "_last7DaysTicket" table if it exists
drop temporary table if exists _last7DaysTicket;

-- create temporary "_last7DaysTicket"
create temporary table _last7DaysTicket
select	cast(a.createDatetime as date) as createDate,
		count(a.ticketid) as numOfNewTickets,
        count(
			case
				when a.ticketStatusid = 3 then '1'
                else null
            end
        ) as numOfSolvedTickets,
		count(
			case
				when a.ticketStatusid = 4 then '1'
                else null
            end
        ) as numOfClosedTickets,
		sum(
			case
				when (a.ticketStatusid = 3 or a.ticketStatusid = 4) then a.spentHour
                else 0
            end
        ) as totalSpentHour
from _searchTicketTbl a
group by cast(a.createDatetime as date);

with
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
_last7Days_numOfTickets as(
select	concat(day(a.reportDate),'/',month(a.reportDate)) as dayMonth,
		case
			when weekday(a.reportDate) = 0 then 'Mon'
            when weekday(a.reportDate) = 1 then 'Tue'
            when weekday(a.reportDate) = 2 then 'Wed'
            when weekday(a.reportDate) = 3 then 'Thu'
            when weekday(a.reportDate) = 4 then 'Fri'
            when weekday(a.reportDate) = 5 then 'Sat'
            else 'Sun'
        end as weekday,
		coalesce(b.numOfNewTickets, 0) as numOfNewTickets,
        coalesce(b.numOfSolvedTickets, 0) as numOfSolvedTickets,
        coalesce(b.numOfClosedTickets, 0) as numOfClosedTickets,
        coalesce(b.totalSpentHour, 0) as totalSpentHour
from _last7Days a
	 left join _last7DaysTicket b on a.reportDate = b.createDate
order by a.reportDate asc
)

select	concat(a.weekday, '-', a.dayMonth) as dayMonth,
		a.numOfNewTickets as numOfNewTickets,
        a.numOfSolvedTickets as numOfSolvedTickets,
        a.numOfClosedTickets as numOfClosedTickets,
        a.totalSpentHour as totalSpentHour
from _last7Days_numOfTickets a;

-- select reportDate, reportDate_1, reportDate_2,reportDate_3,reportDate_4,reportDate_5,reportDate_6;



end $$

-- customer: 	call sp_last7DaysReport(1,'2023-04-21')

-- supporter: 	call sp_last7DaysReport(10,'2023-04-21')

-- admin: 		call sp_last7DaysReport(20,'2023-04-19')
-- admin: 		call sp_last7DaysReport(20,'2023-04-21')
-- admin: 		call sp_last7DaysReport(20,'')

delimiter ;

