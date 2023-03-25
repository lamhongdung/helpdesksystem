use helpdesk;

DROP PROCEDURE IF EXISTS sp_ticket_getTotalOfTicketsByUserid;

DELIMITER $$

-- -----------------------------------------------------
-- Get tickets list by userid.
--
-- This store procedure is used for tickets list in 
-- the table in the "Ticket list" screen.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: call sp_ticket_getTotalOfTicketsByUserid(1,"")
-- supporter: call sp_ticket_getTotalOfTicketsByUserid(2)
-- admin: call sp_ticket_getTotalOfTicketsByUserid(3)

CREATE PROCEDURE sp_ticket_getTotalOfTicketsByUserid(in_userid long, in_searchTerm varchar(2000))
BEGIN

-- user role
declare userRole varchar(255);

-- get user role by user id
set userRole = (select a.role 
				from user a
				where a.id = in_userid
                );

-- --------------------
-- ROLE_CUSTOMER
-- --------------------

-- get all priorities in tickets of specific user "in_userid"
if userRole = "ROLE_CUSTOMER" then

	select 	count(a.ticketid) as totalOfTickets
    from ticket a
	where a.creatorid = in_userid;

-- --------------------
-- ROLE_SUPPORTER
-- --------------------
   
-- get teams have tickets and supporter "in_userid" belongs to these teams.
-- get all tickets are logged for the above teams.
-- get all priorities of tickets found

-- elseif userRole = "ROLE_SUPPORTER" then


-- 	select 0 as id, 'All' as description

-- 	union all
--     
-- 	select 	distinct
-- 			a.priorityid as id,
-- 			concat(a.priorityid,' - ', coalesce(c.name,'')) as description
-- 	from ticket a
-- 		-- get teams have tickets and supporter "in_userid" belongs to these teams
-- 		inner join (select z.teamid
-- 					from teamSupporter z
-- 					where z.supporterid = in_userid) b on a.teamid = b.teamid
--         left join priority c on a.priorityid = c.id;

-- --------------------
-- ROLE_ADMIN
-- --------------------

-- get all priorities which have tickets
    
-- else  
--     
--         
-- 	select 0 as id, 'All' as description

-- 	union all

-- 	select 	z.priorityid as id,
-- 			concat(z.priorityid,' - ', coalesce(b.name,'')) as description
--     from(
-- 		select distinct
-- 				a.priorityid
-- 		from ticket a
--     ) z
-- 		left join priority b on z.priorityid = b.id;
    
end if;

END $$

-- customer: call sp_ticket_getTotalOfTicketsByUserid(1)
-- supporter: call sp_ticket_getTotalOfTicketsByUserid(2)
-- admin: call sp_ticket_getTotalOfTicketsByUserid(3)

DELIMITER ;