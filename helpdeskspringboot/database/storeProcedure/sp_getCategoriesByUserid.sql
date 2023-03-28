use helpdesk;

drop procedure if exists sp_getCategoriesByUserid;

delimiter $$

-- -----------------------------------------------------
-- Get categories have tickets by userid.
--
-- This store procedure is used for loading categories in 
-- the dropdown "category" in the "Ticket list" screen.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: 	call sp_getCategoriesByUserid(1)
-- supporter: 	call sp_getCategoriesByUserid(10)
-- admin: 		call sp_getCategoriesByUserid(20)

create procedure sp_getCategoriesByUserid(in_userid int)
begin
  
	-- create temporary "ticketTbl" table contains tickets by user id and by user role
 	call sp_ticketTbl(in_userid);

	-- get categories have tickets by user id and by user role
    select a.id, a.description
    from(
		select 0 as id, 'All' as description

		union all

		select 	distinct
				a.categoryid as id,
				concat(a.categoryid,' - ', coalesce(b.name,'')) as description
		from ticketTbl a
			left join category b on a.categoryid = b.id
	) a
    order by a.id, a.description;
    
end $$

-- customer: 	call sp_getCategoriesByUserid(1)
-- supporter: 	call sp_getCategoriesByUserid(10)
-- admin: 		call sp_getCategoriesByUserid(20)

delimiter ;