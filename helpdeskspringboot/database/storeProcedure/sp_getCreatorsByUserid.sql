use helpdesk;

drop procedure if exists sp_getCreatorsByUserid;

delimiter $$

-- -----------------------------------------------------
-- Get all creators by userid.
--
-- This store procedure is used for loading creators in 
-- the dropdown "creator" in the "Ticket list" screen.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: 	call sp_getCreatorsByUserid(1)
-- supporter: 	call sp_getCreatorsByUserid(10)
-- admin: 		call sp_getCreatorsByUserid(20)

create procedure sp_getCreatorsByUserid(in_userid int)
begin

	-- create temporary "_ticketTbl" table contains tickets by user id and by user role
 	call sp_ticketTbl(in_userid);

	-- get creators by user id, user role
    select a.id, a.description
    from(
		select 0 as id, 'All' as description

		union all

		select 	distinct
				a.creatorid as id,
				concat(a.creatorid,' - ', coalesce(b.lastName,''),' ', coalesce(b.firstName,'')) as description
		from _ticketTbl a
			left join user b on a.creatorid = b.id
	) a
    order by a.id, a.description;
  
end $$

-- customer: 	call sp_getCreatorsByUserid(1)
-- supporter: 	call sp_getCreatorsByUserid(10)
-- admin: 		call sp_getCreatorsByUserid(20)

delimiter ;