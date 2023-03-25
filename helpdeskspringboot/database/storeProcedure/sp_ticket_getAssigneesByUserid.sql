use helpdesk;

DROP PROCEDURE IF EXISTS sp_ticket_getAssigneesByUserid;

DELIMITER $$

-- -----------------------------------------------------
-- Get all assignees by userid.
--
-- This store procedure is used for loading assignees in 
-- the dropdown "assignee" in the "Ticket list" screen.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: call sp_ticket_getAssigneesByUserid(1)
-- supporter: call sp_ticket_getAssigneesByUserid(2)
-- admin: call sp_ticket_getAssigneesByUserid(3)

CREATE PROCEDURE sp_ticket_getAssigneesByUserid(in_userid int)
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

-- get all assignees who are assigned to solve tickets of user "in_userid"
if userRole = "ROLE_CUSTOMER" then

	select 0 as id, 'All' as description

	union all
    
	select 	coalesce(z.assigneeid,'-1') as id,
			concat(z.assigneeid,' - ', coalesce(b.lastName,'Unknown'),' ', coalesce(b.firstName,'person')) as description
	from(
		select 	distinct coalesce(a.assigneeid,-1) as assigneeid
		from ticket a
		where a.creatorid = in_userid
    ) z
		left join user b on z.assigneeid = b.id;

-- --------------------
-- ROLE_SUPPORTER
-- --------------------
   
-- get teams have tickets and supporter "in_userid" belongs to these teams.
-- get all tickets are logged for the above teams.
elseif userRole = "ROLE_SUPPORTER" then


	select 0 as id, 'All' as description

	union all
    
	select 	distinct
			coalesce(a.assigneeid,-1) as id,
			concat(coalesce(a.assigneeid,-1),' - ', coalesce(c.lastName,'Unknown'),' ', coalesce(c.firstName,'person')) as description
	from ticket a
		-- get teams have tickets and supporter "in_userid" belongs to these teams
		inner join (select z.teamid
					from teamSupporter z
					where z.supporterid = in_userid) b on a.teamid = b.teamid
        left join user c on a.assigneeid = c.id;

-- --------------------
-- ROLE_ADMIN
-- --------------------

-- get all supporters who have tickets
    
else  
    
        
	select 0 as id, 'All' as description

	union all

	select 	coalesce(z.assigneeid,-1) as id,
			concat(coalesce(z.assigneeid,-1),' - ', coalesce(b.lastName,'Unknown'),' ', coalesce(b.firstName,'person')) as description
    from(
		select distinct
				a.assigneeid
		from ticket a
    ) z
		left join user b on z.assigneeid = b.id;
    
end if;
  
END $$

-- customer: call sp_ticket_getAssigneesByUserid(1)
-- supporter: call sp_ticket_getAssigneesByUserid(2)
-- admin: call sp_ticket_getAssigneesByUserid(3)

DELIMITER ;