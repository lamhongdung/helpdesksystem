use helpdesk;

-- drop function if it exists
drop function if exists fn_spentHour;

delimiter $$

-- -----------------------------------------------------
-- calculate spent hours between 2 datetimes
--
-- Input parameters:
--
-- 	- in_ticketStatusid: ticket status id
-- 		+ 1: Open
-- 		+ 2: Assigned
-- 		+ 3: Resolved
-- 		+ 4: Closed
-- 		+ 5: Cancel
-- 	- in_createDatetime: ticket is created on this time
-- 	- in_lastUpdateDatetime: last time the ticket was updated
-- 
-- 	- return value: ex: 108.3 (hours)
-- -----------------------------------------------------

-- select fn_spentHour(4, '2023-04-10 22:29:25', '2023-04-10 22:29:25')
-- select fn_spentHour(2, '2023-04-10 22:29:25', '2023-04-10 22:29:25')

create function fn_spentHour(
								in_ticketStatusid int,
                                in_createDatetime datetime,
                                in_lastUpdateDatetime datetime
							)
returns float deterministic
begin

-- if ticket status = 'Closed'(4) or 'Cancel'(5) then
-- calculate spent hours based on createDatetime and lastUpdateDatetime
if (in_ticketStatusid = 4 or in_ticketStatusid = 5) then

	-- difference between in_createDatetime and in_lastUpdateDatetime in hours
	return timestampdiff(second, in_createDatetime, in_lastUpdateDatetime)/3600.0;
    
else -- calculate spent hours based on createDatetime and current datetime

	-- difference between in_createDatetime and now() in hours
	return timestampdiff(second, in_createDatetime, now())/3600.0;
    
end if;


end $$

-- select fn_spentHour(4, '2023-04-10 22:29:25', '2023-04-10 22:29:25')
-- select fn_spentHour(2, '2023-04-10 22:29:25', '2023-04-10 22:29:25')

delimiter ;

