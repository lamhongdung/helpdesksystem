use helpdesk;

drop procedure if exists sp_getSupportersByStatus;

delimiter $$

-- -----------------------------------------------------
-- Get supporters by its status.
--
-- Input parameters:
-- 	- in_status:
-- 		= 0: all status(Active + Inactive) + 1 dummy
-- 		= 1: Active + 1 dummy
-- 		= 2: Inactive + 1 dummy
-- -----------------------------------------------------

-- call sp_getSupportersByStatus(0)
-- call sp_getSupportersByStatus(1)
-- call sp_getSupportersByStatus(2)

create procedure sp_getSupportersByStatus(in_status int)
begin

-- drop the temporary "_allSupporters" table if it exists
drop temporary table if exists _allSupporters;

create temporary table _allSupporters
select 	a.id as id,
		concat(a.id, ' - ', a.lastName, ' ', a.firstName, ' - ', a.status) as description,
		a.status as status
from user a
where a.role = 'ROLE_SUPPORTER';

-- get all supporters + 1 dummy
if (in_status = 0) then
	
    -- dummy value
	select 0 as id, 'All' as description
    
    union all
    
	select a.id, a.description
    from _allSupporters a;

-- get active supporters + 1 dummy    
elseif (in_status = 1) then

	-- dummy value
	select 0 as id, 'All' as description
    
    union all
    
	select a.id, a.description
    from _allSupporters a
    where a.status = 'Active';
    
-- get inactive supporters + 1 dummy
else

	-- dummy value
	select 0 as id, 'All' as description
    
    union all
    
	select a.id, a.description
    from _allSupporters a
    where a.status = 'Inactive';
    
end if;
  
end $$

-- call sp_getSupportersByStatus(0)
-- call sp_getSupportersByStatus(1)
-- call sp_getSupportersByStatus(2)

delimiter ;