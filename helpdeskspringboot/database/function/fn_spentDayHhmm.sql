use helpdesk;

-- drop function if it exists
drop function if exists fn_spentDayHhmm;

delimiter $$

-- -----------------------------------------------------
-- calculate spent days-hours-minutes between 2 datetimes
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
-- 	- in_lastUpdateDatetime: last date time the ticket was updated
--
-- Return value:
-- 	- x days y hours z minutes. ex: 4 days 11 hours 59 minutes
-- -----------------------------------------------------

-- select fn_spentDayHhmm(4, '2023-04-10 22:29:25', '2023-04-10 22:29:25')
-- select fn_spentDayHhmm(2, '2023-04-10 22:29:25', '2023-04-10 22:29:25')

create function fn_spentDayHhmm(
								in_ticketStatusid int,
                                in_createDatetime datetime,
                                in_lastUpdateDatetime datetime
								)
returns varchar(255) deterministic
begin

-- total spent seconds
declare totalSeconds int;

-- difference in day
declare dayPart int;
-- difference in hour
declare hourPart int;
-- difference in minute
declare minutePart int;

-- difference in days string
declare dayString varchar(255);

-- difference in hours string
declare hourString varchar(255);

-- difference in minutes string
declare minuteString varchar(255);

-- if ticket status = 'Closed'(4) or 'Cancel'(5) then
-- calculate spent seconds based on createDatetime and lastUpdateDatetime
if (in_ticketStatusid = 4 or in_ticketStatusid = 5) then

	-- difference between in_createDatetime and in_lastUpdateDatetime in seconds
	set totalSeconds = timestampdiff(second, in_createDatetime, in_lastUpdateDatetime);
    
else -- calculate spent seconds based on createDatetime and current datetime

	-- difference between in_createDatetime and now() in seconds
	set totalSeconds = timestampdiff(second, in_createDatetime, now());
    
end if;

-- difference in days.
-- 1 day has 24 hours. 1 hour has 3600 seconds.
set dayPart = floor(totalSeconds / 3600 / 24);

-- difference in hours
set hourPart = floor(mod(totalSeconds, 3600 * 24)/3600);

-- difference in minutes
set minutePart = floor(mod(totalSeconds, 3600)/60);

-- difference in days string
if (dayPart = 0) then
	set dayString = '';
elseif (dayPart = 1) then 
	set dayString = '1 day ';
else
	set dayString = concat(dayPart, ' days ');
end if;

-- difference in hours string
if (hourPart < 2) then
	set hourString = concat(hourPart,' hour ');
else
	set hourString = concat(hourPart,' hours ');
end if;

-- difference in minutes string
if (minutePart < 2) then
	set minuteString = concat(minutePart,' minute ');
else
	set minuteString = concat(minutePart,' minutes ');
end if;

-- result
return concat(dayString, hourString, minuteString);

end $$

-- select fn_spentDayHhmm(4, '2023-04-10 22:29:25', '2023-04-10 22:29:25')
-- select fn_spentDayHhmm(2, '2023-04-10 22:29:25', '2023-04-10 22:29:25')

delimiter ;

