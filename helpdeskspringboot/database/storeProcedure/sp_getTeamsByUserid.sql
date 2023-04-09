use helpdesk;

drop procedure if exists sp_getTeamsByUserid;

delimiter $$

-- -----------------------------------------------------
-- Get all teams by userid.
--
-- This store procedure is used for loading teams in 
-- the dropdown "team" in the "Ticket list" screen.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: 	call sp_getTeamsByUserid(1)
-- supporter: 	call sp_getTeamsByUserid(10)
-- admin: 		call sp_getTeamsByUserid(20)

create procedure sp_getTeamsByUserid(in_userid int)
begin

	-- create temporary "_ticketTbl" table contains tickets by user id and by user role
 	call sp_ticketTbl(in_userid);

	-- get teams have tickets by user id, user role
    select a.id, a.description
    from(
		select 0 as id, 'All' as description

		union all

		select 	distinct
				a.teamid as id,
				concat(a.teamid,' - ', coalesce(b.name,'')) as description
		from _ticketTbl a
			left join team b on a.teamid = b.id
	) a
    order by a.id, a.description;
        
  
end $$

-- customer: 	call sp_getTeamsByUserid(1)
-- supporter: 	call sp_getTeamsByUserid(10)
-- admin: 		call sp_getTeamsByUserid(20)

delimiter ;