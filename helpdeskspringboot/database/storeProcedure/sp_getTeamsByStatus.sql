use helpdesk;

drop procedure if exists sp_getTeamsByStatus;

delimiter $$

-- -----------------------------------------------------
-- Get teams by its status.
--
-- Input parameters:
-- 	- in_status:
-- 		= 0: all status(Active + Inactive) + 1 dummy
-- 		= 1: Active + 1 dummy
-- 		= 2: Inactive + 1 dummy
-- -----------------------------------------------------

-- call sp_getTeamsByStatus(0)
-- call sp_getTeamsByStatus(1)
-- call sp_getTeamsByStatus(2)

create procedure sp_getTeamsByStatus(in_status int)
begin

-- drop the temporary "_allTeams" table if it exists
drop temporary table if exists _allTeams;

create temporary table _allTeams
select 	a.id as id,
		concat(a.id, ' - ', a.name, ' - ',
					case a.assignmentmethod
						when 'A' then 'Auto'
						else 'Manual'
					end) as description,
		a.status as status
from team a;

-- get all teams + 1 dummy
if (in_status = 0) then
	
    -- dummy value
	select 0 as id, 'All' as description
    
    union all
    
	select a.id, a.description
    from _allTeams a;

-- get active teams + 1 dummy
elseif (in_status = 1) then

	-- dummy value
	select 0 as id, 'All' as description
    
    union all
    
	select a.id, a.description
    from _allTeams a
    where a.status = 'Active';
    
-- get inactive teams + 1 dummy
else

	-- dummy value
	select 0 as id, 'All' as description
    
    union all
    
	select a.id, a.description
    from _allTeams a
    where a.status = 'Inactive';
    
end if;
  
end $$

-- call sp_getTeamsByStatus(0)
-- call sp_getTeamsByStatus(1)
-- call sp_getTeamsByStatus(2)

delimiter ;