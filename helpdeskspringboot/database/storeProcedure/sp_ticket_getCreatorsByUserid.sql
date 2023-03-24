use helpdesk;

DROP PROCEDURE IF EXISTS sp_ticket_getCreatorsByUserid;

DELIMITER $$

-- -----------------------------------------------------
-- Get all creators by userid.
--
-- This store procedure is used for loading creators in 
-- the dropdown creator in the "Ticket list" screen.
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: call sp_ticket_getCreatorsByUserid(1)
-- supporter: call sp_ticket_getCreatorsByUserid(2)
-- admin: call sp_ticket_getCreatorsByUserid(3)

CREATE PROCEDURE sp_ticket_getCreatorsByUserid(in_userid int)
BEGIN

-- user role
declare userRole varchar(255);

-- get user role by user id
select a.role
into userRole
from user a
where a.id = in_userid;

-- --------------------
-- ROLE_CUSTOMER
-- --------------------
if userRole = "ROLE_CUSTOMER" then

	--
	-- creator is him-self
    --
    
	select 	a.id as id, 
			concat(COALESCE(a.id,''),' - ', COALESCE(a.lastName,''),' ', COALESCE(a.firstName,'')) as description
    from user a
    where a.id = in_userid;

-- --------------------
-- ROLE_SUPPORTER
-- --------------------
    
elseif userRole = "ROLE_SUPPORTER" then

	--
	-- get creators who created ticket which has team that supporter belongs to
    --
    
	select 0 as id, 'All' as description

	union all
    
	select 	distinct
			a.creatorid as id, 
			concat(a.creatorid,' - ', COALESCE(c.lastName,'No creator'),' ', COALESCE(c.firstName,'')) as description
	from ticket a
		inner join (select z.teamid
					from teamSupporter z
					where z.supporterid = in_userid) b on a.teamid = b.teamid
        left join user c on a.creatorid = c.id;
    
else  
-- --------------------
-- ROLE_ADMIN
-- --------------------
  
	--
	-- get all creators who have tickets
    --
    
	select 0 as id, 'All' as description

	union all

	select distinct
		a.creatorid as id,
		concat(COALESCE(b.id,''),' - ', COALESCE(b.lastName,''),' ', COALESCE(b.firstName,'')) as description
	from ticket a
	left join user b on a.creatorid = b.id;
    
end if;
  
END $$

-- customer: call sp_ticket_getCreatorsByUserid(1)
-- supporter: call sp_ticket_getCreatorsByUserid(2)
-- admin: call sp_ticket_getCreatorsByUserid(3)

DELIMITER ;