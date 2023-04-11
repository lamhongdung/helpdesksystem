use helpdesk;

drop procedure if exists sp_getNextTicketStatus;

delimiter $$

-- -----------------------------------------------------
-- Get next appropriate ticket status.
--
-- Input parameters:
-- 	- in_ticketid: ticket id
-- -----------------------------------------------------

-- call sp_getNextTicketStatus(1)

create procedure sp_getNextTicketStatus(in_ticketid int)
begin

-- current ticket status
declare currentTicketStatus int;

-- get current ticket status
set currentTicketStatus = (	select a.ticketStatusid 
							from ticket a
							where a.ticketid = in_ticketid
							);

-- drop the temporary "_ticketStatus" table if it exists
drop temporary table if exists _ticketStatus;

-- create temporary "_ticketStatus" table
create temporary table _ticketStatus
select	a.statusid as id,
		concat(a.statusid, ' - ', a.name) as description
from ticketStatus a;

if (currentTicketStatus = 1) then
	select a.id, a.description
    from _ticketStatus a;
elseif (currentTicketStatus = 4 or currentTicketStatus = 5) then
	select a.id, a.description
    from _ticketStatus a
    where a.id = currentTicketStatus;
else
	select a.id, a.description
    from _ticketStatus a
    where a.id >= 2;
end if;

  
end $$

-- call sp_getNextTicketStatus(1)
-- call sp_getNextTicketStatus(103)

delimiter ;