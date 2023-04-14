use helpdesk;

-- drop function if it exists
drop function if exists fn_spentDayHhmm;

delimiter $$

-- -----------------------------------------------------
-- calculate spent days-hours-minutes between datetime1 and datetime2
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
-- -----------------------------------------------------

-- select fn_spentDayHhmm(4, '2023-04-10 22:29:25', '2023-04-10 22:29:25')
-- select fn_spentDayHhmm(2, '2023-04-10 22:29:25', '2023-04-10 22:29:25')

create function fn_spentDayHhmm(
								in_ticketStatusid int,
                                in_createDatetime datetime,
                                in_lastUpdateDatetime datetime
								)
returns varchar(255) not deterministic
begin

-- total spent seconds
declare totalSecond int;

-- difference in day
declare dayPart int;
-- difference in hour
declare hourPart int;
-- difference in minute
declare minutePart int;

-- difference in 'days hours minites'
declare spentDayHhmm varchar(255);

-- if ticket status = 'Closed'(4) or 'Cancel'(5) then
-- calculate spent seconds based on createDatetime and lastUpdateDatetime
if (in_ticketStatusid = 4 or in_ticketStatusid = 5) then

	set totalSecond = timestampdiff(second, in_createDatetime, in_lastUpdateDatetime);
    
else -- calculate spent seconds based on createDatetime and current datetime

	set totalSecond = timestampdiff(second, in_createDatetime, now());
    
end if;

-- difference in days
set dayPart = floor(totalSecond / 3600 / 24);

-- difference in hours
set hourPart = floor(mod(totalSecond, 3600 * 24)/3600);

-- difference in minutes
set minutePart = floor(mod(totalSecond, 3600)/60);

if (dayPart = 0) then
	set spentDayHhmm = '';
elseif (dayPart = 1) then 
	set spentDayHhmm = '1 day ';
else
	set spentDayHhmm = concat(dayPart, ' days ');
end if;

return concat(spentDayHhmm, hourPart, ' hours ', minutePart, ' minutes');

end $$

-- select fn_spentDayHhmm(4, '2023-04-10 22:29:25', '2023-04-10 22:29:25')
-- select fn_spentDayHhmm(2, '2023-04-10 22:29:25', '2023-04-10 22:29:25')

delimiter ;

