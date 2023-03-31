use helpdesk;

-- drop procedure "sp_searchTickets" if it exists
drop procedure if exists sp_searchTickets;

delimiter $$

-- -----------------------------------------------------
-- Get tickets list by user id, user role and based on search criteria.
--
-- This store procedure is used for tickets table in 
-- the "Ticket list" screen.
--
-- Input parameters:
--
-- 	- in_userid: user id
--
-- 	- in_pageNumber: page number(0,1,2,...)
-- 	- in_pageSize: page size(default = 5)
--
-- 	- in_searchTerm: search term
-- 	- in_fromDate: from date(default = first day of current year)
-- 	- in_toDate: to date(current date)
-- 	- in_categoryid: category id
-- 	- in_priorityid: priority id
-- 	- in_creatorid: creator id(who created ticket)
-- 	- in_teamid: team id(a team may has multi supporters)
-- 	- in_assignee: assignee is person will resove the ticket
-- 	- in_sla: service level agreement. Check whether a certain ticket is on time or late
-- 	- in_ticketStatusid: ticket status id: has 5 status: 
--      - 1: Open
--      - 2: Assigned
--      - 3: Resolved
--      - 4: Closed
--      - 5: Cancel
-- -----------------------------------------------------

-- customer: 	call sp_searchTickets(1,0,5,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')
-- customer: 	call sp_searchTickets(1,0,5,'','','2023-03-26','0','0','1','0','0','','0')
-- customer: 	call sp_searchTickets(1,0,5,'','','2023-03-20','0','0','1','0','0','','0')
-- customer: 	call sp_searchTickets(1,0,5,'','2023-01-01','2023-03-26','1','0','1','0','0','','0')

-- supporter: 	call sp_searchTickets(10,0,5,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')
-- admin: 		call sp_searchTickets(20,0,5,'','2023-01-01','2023-03-29','0','0','0','0','0','','0')

create procedure sp_searchTickets(	in_userid int, 
									in_pageNumber int, 
									in_pageSize int,
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

-- create temporary "searchTicketTbl" table contains tickets by user id, user role
-- and by search criteria
call sp_searchTicketTbl(in_userid, in_searchTerm, in_fromDate, in_toDate, in_categoryid,
						in_priorityid, in_creatorid, in_teamid, in_assigneeid, in_sla,
						in_ticketStatusid);
    
select a.*
from searchTicketTbl a
order by a.createDatetime desc, a.assigneeName asc, a.subject asc
-- only 1 page with 5 elements
limit in_pageNumber, in_pageSize;

end $$

-- customer: 	call sp_searchTickets(1,0,5,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')
-- customer: 	call sp_searchTickets(1,0,5,'','','2023-03-26','0','0','1','0','0','','0')
-- customer: 	call sp_searchTickets(1,0,5,'','','2023-03-20','0','0','1','0','0','','0')
-- customer: 	call sp_searchTickets(1,0,5,'','2023-01-01','2023-03-26','1','0','1','0','0','','0')

-- supporter: 	call sp_searchTickets(10,0,5,'','2023-01-01','2023-03-26','0','0','1','0','0','','0')
-- admin: 		call sp_searchTickets(20,0,5,'','2023-01-01','2023-03-29','0','0','0','0','0','','0')

delimiter ;

