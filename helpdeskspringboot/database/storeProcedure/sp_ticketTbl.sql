use helpdesk;

drop procedure if exists sp_ticketTbl;

delimiter $$

-- -----------------------------------------------------
-- Create temporary "_ticketTbl" table contains tickets based on user id and user role.
--
-- Input parameters:
-- 	- in_userid: user id
-- -----------------------------------------------------

-- customer: 	call sp_ticketTbl(1)
-- supporter: 	call sp_ticketTbl(10)
-- admin: 		call sp_ticketTbl(20)

create procedure sp_ticketTbl(in_userid int)
begin

-- user role
declare userRole varchar(255);

-- drop the temporary "_ticketTbl" table if exists
drop temporary table if exists _ticketTbl;

-- create new temporary table "_ticketTbl"
create temporary table _ticketTbl(

	`ticketid` int,
	`subject` varchar(255),
	`categoryid` int,
	`creatorid` int,
	`teamid` int,
	`priorityid` int,
	`assigneeid` int default null,
	`ticketStatusid` int,
	`content` text,
	`customFilename` varchar(255) default null,
	`createDatetime` datetime,
	`lastUpdateDatetime` datetime,
	`lastUpdateByUserid` int
);
    
-- get user role by user id
set userRole = (select a.role 
				from user a
				where a.id = in_userid
                );

-- --------------------
-- role "customer"
-- --------------------

-- if role is "customer"
if userRole = "ROLE_CUSTOMER" then

	-- get all tickets of the creator "in_userid"
  
	insert into _ticketTbl
	select 	a.*
	from ticket a
	where a.creatorid = in_userid;

-- --------------------
-- role "supporter"
-- --------------------

-- -- if role is "supporter"   
elseif userRole = "ROLE_SUPPORTER" then
   
	-- get all tickets of teams that the supporter "in_userid" belongs to
   
	insert into _ticketTbl
	select 	a.*
	from ticket a
		-- get teams that the supporter "in_userid" belongs to
		inner join (select z.teamid
					from teamSupporter z
					where z.supporterid = in_userid) b on a.teamid = b.teamid;

-- --------------------
-- role "admin"
-- --------------------
    
-- if role is "Admin"
else

    -- get all tickets
    
	insert into _ticketTbl
	select 	a.*
    from ticket a;

end if;
  
end $$

-- customer: 	call sp_ticketTbl(1)
-- supporter: 	call sp_ticketTbl(10)
-- admin: 		call sp_ticketTbl(20)

delimiter ;