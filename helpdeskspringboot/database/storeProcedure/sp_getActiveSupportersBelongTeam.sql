use helpdesk;

drop procedure if exists sp_getActiveSupportersBelongTeam;

delimiter $$

-- -----------------------------------------------------
-- Get active supporters belong team.
--
-- Input parameters:
-- 	- in_ticketid: ticket id
-- -----------------------------------------------------

-- call sp_getActiveSupportersBelongTeam(1)

create procedure sp_getActiveSupportersBelongTeam(in_ticketid int)
begin

select 	e.id as id,
		concat(e.id, ' - ', e.lastName, ' ', e.firstName) as description
from user e
	inner join(
				select c.supporterid
				from teamSupporter c
					inner join (
								-- get team value of ticket
								select a.teamid
								from ticket a
								where a.ticketid = in_ticketid
								) b on c.teamid = b.teamid
				) d on e.id = d.supporterid
where e.status = 'Active';
  
end $$

-- call sp_getActiveSupportersBelongTeam(1)

delimiter ;