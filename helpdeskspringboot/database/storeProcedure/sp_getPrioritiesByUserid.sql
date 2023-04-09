use helpdesk;

drop procedure if exists sp_getPrioritiesByUserid;

delimiter $$

-- -----------------------------------------------------
-- Get priorities have tickets by userid.
--
-- This store procedure is used for loading priorities in 
-- the dropdown "priority" in the "Ticket list" screen.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: 	call sp_getPrioritiesByUserid(1)
-- supporter: 	call sp_getPrioritiesByUserid(10)
-- admin: 		call sp_getPrioritiesByUserid(20)

create procedure sp_getPrioritiesByUserid(in_userid int)
begin

	-- create temporary "_ticketTbl" table contains tickets by user id and by user role
 	call sp_ticketTbl(in_userid);
    
	-- get priorities by user id, user role
    select a.id, a.description
    from(
		select 0 as id, 'All' as description

		union all

		select 	distinct
				a.priorityid as id,
				concat(a.priorityid,' - ', coalesce(b.name,'')) as description
		from _ticketTbl a
			left join priority b on a.priorityid = b.id
	) a
	order by a.id, a.description;
    
end $$

-- customer: 	call sp_getPrioritiesByUserid(1)
-- supporter: 	call sp_getPrioritiesByUserid(10)
-- admin: 		call sp_getPrioritiesByUserid(20)

delimiter ;