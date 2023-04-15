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

-- current ticket status id
declare currentTicketStatusid int;

-- get current ticket status id:
--  - 1: Open
--  - 2: Assigned
--  - 3: Resolved
--  - 4: Closed
--  - 5: Cancel
set currentTicketStatusid = (	select a.ticketStatusid 
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

-- if current ticket status = 'Open'(1) then get all ticket status
if (currentTicketStatusid = 1) then

	select a.id, a.description
    from _ticketStatus a;
    
-- if current ticket status = 'Closed'(4) or = 'Cancel'(5) then only get that ticket status
elseif (currentTicketStatusid = 4 or currentTicketStatusid = 5) then

	select a.id, a.description
    from _ticketStatus a
    where a.id = currentTicketStatusid;

-- if current ticket status id = 'Assigned'(2) or = 'Resolved'(3) 
-- then get all ticket status except ticket status 'Open'(1)
else

	select a.id, a.description
    from _ticketStatus a
    where a.id >= 2;
    
end if;

  
end $$

-- call sp_getNextTicketStatus(1)
-- call sp_getNextTicketStatus(103)

delimiter ;