use helpdesk;

DROP PROCEDURE IF EXISTS sp_ticket_getCategoriesByUserid;

DELIMITER $$

-- -----------------------------------------------------
-- Get categories have tickets by userid.
--
-- This store procedure is used for loading categories in 
-- the dropdown "category" in the "Ticket list" screen.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: call sp_ticket_getCategoriesByUserid(1)
-- supporter: call sp_ticket_getCategoriesByUserid(2)
-- admin: call sp_ticket_getCategoriesByUserid(3)

CREATE PROCEDURE sp_ticket_getCategoriesByUserid(in_userid int)
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

-- get all categories in tickets of specific user "in_userid"
if userRole = "ROLE_CUSTOMER" then

	select 0 as id, 'All' as description

	union all
    
	select 	z.categoryid as id,
			concat(z.categoryid,' - ', coalesce(b.name,'')) as description
	from(
		select 	distinct a.categoryid as categoryid
		from ticket a
		where a.creatorid = in_userid
    ) z
		left join category b on z.categoryid = b.id;

-- --------------------
-- ROLE_SUPPORTER
-- --------------------
   
-- get teams have tickets and supporter "in_userid" belongs to these teams.
-- get all tickets are logged for the above teams.
-- get all categories of tickets found
elseif userRole = "ROLE_SUPPORTER" then


	select 0 as id, 'All' as description

	union all
    
	select 	distinct
			a.categoryid as id,
			concat(a.categoryid,' - ', coalesce(c.name,'')) as description
	from ticket a
		-- get teams have tickets and supporter "in_userid" belongs to these teams
		inner join (select z.teamid
					from teamSupporter z
					where z.supporterid = in_userid) b on a.teamid = b.teamid
        left join category c on a.categoryid = c.id;

-- --------------------
-- ROLE_ADMIN
-- --------------------

-- get all supporters who have tickets
    
else  
    
        
	select 0 as id, 'All' as description

	union all

	select 	z.categoryid as id,
			concat(z.categoryid,' - ', coalesce(b.name,'')) as description
    from(
		select distinct
				a.categoryid
		from ticket a
    ) z
		left join category b on z.categoryid = b.id;
    
end if;
  
END $$

-- customer: call sp_ticket_getCategoriesByUserid(1)
-- supporter: call sp_ticket_getCategoriesByUserid(2)
-- admin: call sp_ticket_getCategoriesByUserid(3)

DELIMITER ;