use helpdesk;

drop procedure if exists sp_getAssigneesByUserid;

delimiter $$

-- -----------------------------------------------------
-- Get all assignees by userid and by user role
--
-- This store procedure is used for loading assignees in 
-- the dropdown "assignee" in the "Ticket list" screen.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: 	call sp_getAssigneesByUserid(1)
-- supporter: 	call sp_getAssigneesByUserid(10)
-- admin: 		call sp_getAssigneesByUserid(20)

create procedure sp_getAssigneesByUserid(in_userid int)
begin

	-- create temporary "ticketTbl" table contains tickets by user id and by user role
 	call sp_ticketTbl(in_userid);

	-- get assignees have tickets by user id, user role
    select a.id, a.description
    from(
		select 0 as id, 'All' as description

		union all

		select 	distinct
				coalesce(a.assigneeid,-1) as id,
				concat(coalesce(a.assigneeid,-1),' - ',coalesce(b.lastName,'unassigned'),' ',coalesce(b.firstName,'')) as description
		from ticketTbl a
			left join user b on a.assigneeid = b.id
	) a
    order by a.id, a.description;
	
end $$

-- customer: 	call sp_getAssigneesByUserid(1)
-- supporter: 	call sp_getAssigneesByUserid(10)
-- admin: 		call sp_getAssigneesByUserid(20)

delimiter ;