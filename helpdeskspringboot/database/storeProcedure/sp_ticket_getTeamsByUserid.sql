use helpdesk;

DROP PROCEDURE IF EXISTS sp_ticket_getTeamsByUserid;

DELIMITER $$

-- -----------------------------------------------------
-- Get all teams by userid.
--
-- This store procedure is used for loading teams in 
-- the dropdown "team" in the "Ticket list" screen.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- admin: call sp_ticket_getTeamsByUserid(1)
-- supporter: call sp_ticket_getTeamsByUserid(2)
-- customer: call sp_ticket_getTeamsByUserid(3)

CREATE PROCEDURE sp_ticket_getTeamsByUserid(in_userid int)
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
if userRole = "ROLE_CUSTOMER" then

	-- get teams that customer in_userid created
	select 0 as id, 'All' as description

	union all
    
	select 	z.teamid as id,
			concat(z.teamid,' - ', COALESCE(b.name,'')) as description
	from(
		select 	distinct a.teamid
		from ticket a
		where a.creatorid = in_userid
    ) z
		left join team b on z.teamid = b.id;

-- --------------------
-- ROLE_SUPPORTER
-- --------------------
    
elseif userRole = "ROLE_SUPPORTER" then

	-- get teams that supporter in_userid belongs to
	select 0 as id, 'All' as description

	union all
    
	select 	distinct
			a.teamid as id, 
			concat(a.teamid,' - ', COALESCE(c.name,'')) as description
	from ticket a
		-- get all teams that the supporter in_userid belongs to
		inner join (select z.teamid
					from teamSupporter z
					where z.supporterid = in_userid) b on a.teamid = b.teamid
        left join team c on a.creatorid = c.id;
    
    
-- --------------------
-- ROLE_ADMIN
-- --------------------

else  
    
	-- get all teams have ticket
        
	select 0 as id, 'All' as description

	union all

	select 	z.teamid as id,
			concat(z.teamid,' - ', COALESCE(b.name,'')) as description
    from(
		select distinct
				a.teamid
		from ticket a
    ) z
		left join team b on z.teamid = b.id;
    
end if;
  
END $$

-- admin: call sp_ticket_getTeamsByUserid(1)
-- supporter: call sp_ticket_getTeamsByUserid(2)
-- customer: call sp_ticket_getTeamsByUserid(3)

DELIMITER ;