use helpdesk;

drop procedure if exists sp_getActiveSupportersBelongTeam;

delimiter $$

-- -----------------------------------------------------
-- Get active supporters belong specific team.
--
-- Input parameters:
-- 	- in_ticketid: ticket id
-- -----------------------------------------------------

-- call sp_getActiveSupportersBelongTeam(1)

create procedure sp_getActiveSupportersBelongTeam(in_ticketid int)
begin

-- get active supporters belong a specific team
select 	e.id as id,
		concat(e.id, ' - ', e.lastName, ' ', e.firstName) as description
from user e
	inner join(
				-- get supporters belong to specific team
				select c.supporterid
				from teamSupporter c
					inner join (
								-- get a team value of a specific ticket id
								select a.teamid
								from ticket a
								where a.ticketid = in_ticketid
								) b on c.teamid = b.teamid
				) d on e.id = d.supporterid
where e.status = 'Active';
  
end $$

-- call sp_getActiveSupportersBelongTeam(1)

delimiter ;