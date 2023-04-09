use helpdesk;

drop procedure if exists sp_saveTicket;

delimiter $$

-- -----------------------------------------------------
-- save ticket.
--
-- Input parameters:
-- - in_creatorid: those who creates ticket.
-- 		if creator is also supporter and this supporter is in team 
-- 		then assignee will be self-creator
-- - in_subject: ticket subject
-- - in_content: ticket content
-- - in_teamid: team id. a team has 1 or multi supporters.
-- 		if (assignment method of team) = 'A'(Auto) 
-- 			then assignee will be person has at least tickets on current date
-- 		if (assignment method of team) = 'M'(Manual) 
-- 			then assignee will be null
-- - in_categoryid: category id
-- - in_priorityid: priority id
-- - in_customFilename: custom file name:
-- 		+ in_customFilename = '': has no attached file
-- 		+ in_customFilename <> '': has attached file
-- -----------------------------------------------------

-- call sp_saveTicket(1, 'here is subject', 'here is content', 1, 1, 1, false, '')

create procedure sp_saveTicket(in_creatorid int,
								in_subject varchar(255),
                                in_content text,
                                in_teamid int,
                                in_categoryid int,
                                in_priorityid int,
								in_customFilename varchar(255))
                                
-- mark label 'sp' in order exit procedure if any
sp:
begin

-- assignment method = 'A'(Auto) or 'M'(Manual)
declare assignmentMethod varchar(255);
-- assignee id(supporter id)
declare assigneeid int;

-- ticket status id:
-- - 1: Open
-- - 2: Assigned
-- - 3: Resolved(do not use in this script)
-- - 4: Closed(do not use in this script)
-- - 5: Cancel(do not use in this script)
declare ticketStatusid int;

-- minimum number of tickets
declare minNumOfTickets int;


-- get assignment method.
-- assignmentMethod = 'A'(Auto) or 'M'(Manual)
set assignmentMethod = (select a.assignmentMethod 
						from team a
						where a.id = in_teamid
						);

-- -------------------------------------------------
-- Case 1: assignment method = 'M'(Manual).
-- -->
-- - assigneeid = null
-- - ticketStatusid = 'Open'
-- -------------------------------------------------

-- if assignment method is Manual('M')
if assignmentMethod = 'M' then

	-- let supporter assigns ticket to a certain supporter manually
	set assigneeid = null;
    
    -- set ticket status = 1('Open')
    set ticketStatusid = 1;
    
    -- save ticket into 'ticket' table
	insert into `ticket`(subject, categoryid, creatorid, teamid, priorityid, 
						assigneeid, ticketStatusid, 
						content, customFilename, createDatetime, lastUpdateDatetime) values 
						(in_subject, in_categoryid, in_creatorid, in_teamid, in_priorityid, 
						assigneeid, ticketStatusid,
						in_content, in_customFilename, now(), now()); 
             
	-- exit store procedure
	leave sp;
    
end if;

-- if assignment method is Auto('A')
if assignmentMethod = 'A' then

    -- set ticket status = 2('Assigned')
    set ticketStatusid = 2;
    
	--
	-- get supporters belong to teamid
	--
    
	-- drop the temporary "_supporterBelongTeamTbl" table if it exists
	drop temporary table if exists _supporterBelongTeamTbl;

	create temporary table _supporterBelongTeamTbl
	select a.supporterid
	from teamSupporter a
	where a.teamid = in_teamid;

	-- -------------------------------------------------
	-- Case 2: creator is also supporter
	-- -->
	-- - assigneeid = in_creatorid
	-- - ticketStatusid = 'Assigned'
	-- -------------------------------------------------

	-- if creator is also supporter then assign assignee to that supporter
    if exists(	select *
				from _supporterBelongTeamTbl a
                where a.supporterid = in_creatorid) then
		
        set assigneeid = in_creatorid;
        
		-- save ticket into 'ticket' table
		insert into `ticket`(subject, categoryid, creatorid, teamid, priorityid, 
							assigneeid, ticketStatusid, 
							content, customFilename, createDatetime, lastUpdateDatetime) values 
							(in_subject, in_categoryid, in_creatorid, in_teamid, in_priorityid, 
							assigneeid, ticketStatusid,
							in_content, in_customFilename, now(), now());
                            
		-- exit store procedure
		leave sp;
                            
    end if; -- end of check exists
    
	-- ----------------------------------------------------------------------------
	-- Case 3: assign ticket to supporter who has at least tickets on current date
	-- -->
	-- - assigneeid = (supporter has at least tickets)
	-- - ticketStatusid = 'Assigned'
	-- ----------------------------------------------------------------------------  

	--
	-- get number of tickets of each supporter on current date
	--
	-- drop the temporary "_supporterNumOfTicketTbl" table if it exists
	drop temporary table if exists _supporterNumOfTicketTbl;

	create temporary table _supporterNumOfTicketTbl
	select 	a.supporterid,
			count(coalesce(b.ticketid, null)) as numOfTickets
	from _supporterBelongTeamTbl a
		left join ticket b on 	a.supporterid = b.assigneeid and 
								-- only consider on current date
								left(coalesce(b.createDatetime,''),10) = left(now(),10)
	group by a.supporterid;

	-- get minimum of tickets
	set minNumOfTickets = (	select min(numOfTickets) 
							from _supporterNumOfTicketTbl a
							);

	-- drop the temporary "_supporterMinNumOfTicketTbl" table if it exists
	drop temporary table if exists _supporterMinNumOfTicketTbl;

	create temporary table _supporterMinNumOfTicketTbl
    -- get supporters have the same at least number of tickets on current date
	select a.*
	from _supporterNumOfTicketTbl a
	where a.numOfTickets = minNumOfTickets;

	-- get 1 supporter who has at least tickets of current date.
	-- in case there are many supporters who have the same at least tickets 
	-- then get random 1 supporter of them
	set assigneeid = (	select a.supporterid
						from _supporterMinNumOfTicketTbl a
						order by rand()
						limit 1
						);

		-- save ticket into 'ticket' table
		insert into `ticket`(subject, categoryid, creatorid, teamid, priorityid, 
							assigneeid, ticketStatusid, 
							content, customFilename, createDatetime, lastUpdateDatetime) values 
							(in_subject, in_categoryid, in_creatorid, in_teamid, in_priorityid, 
							assigneeid, ticketStatusid,
							in_content, in_customFilename, now(), now());
                    
end if;

end $$

delimiter ;