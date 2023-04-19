use helpdesk;

drop procedure if exists sp_saveTicket;

delimiter $$

-- -----------------------------------------------------
-- save ticket into the 'ticket' table
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

create procedure sp_saveTicket(	in_creatorid int,
								in_subject varchar(255),
                                in_content text,
                                in_teamid int,
                                in_categoryid int,
                                in_priorityid int,
								in_customFilename varchar(255))
                                
-- mark label 'sp' in order to exit procedure if any
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
    
    -- save ticket into the 'ticket' table
	insert into `ticket`(subject, categoryid, creatorid, teamid, priorityid, 
						assigneeid, ticketStatusid, 
						content, customFilename, createDatetime, lastUpdateDatetime,
                        lastUpdateByUserid) values
                        
						(in_subject, in_categoryid, in_creatorid, in_teamid, in_priorityid, 
						assigneeid, ticketStatusid,
						in_content, in_customFilename, now(), now(),
                        creatorid); 
             
	-- exit store procedure
	leave sp;
    
end if;

-- if assignment method is Auto('A')
if assignmentMethod = 'A' then
    
	--
	-- create temporary '_workload' table.
    -- This temporary '_workload' table contains number of tickets of each [teamid, supporterid]
    -- on current date.
    -- 
    -- "_workload" = [teamid, teamStatus, supporterid, supporterStatus, createDate, numOfTickets]
	--
    call sp_workload(cast(now() as date), cast(now() as date));
    
	-- drop the temporary "_activeSupportersBelongTeam" table if it exists
	drop temporary table if exists _activeSupportersBelongTeam;

	-- get active supporters and their number of tickets
	create temporary table _activeSupportersBelongTeam
	select a.supporterid, a.numOfTickets
	from _workload a
	where a.teamid = in_teamid and a.supporterStatus = 'Active';
    
	-- -------------------------------------------------
	-- Case 2: could not find any active supporters because although supporters belong team
    -- 			but their status may be 'Inactive'
	-- -->
	-- - assigneeid = null
	-- - ticketStatusid = 'Open'
	-- -------------------------------------------------
    
	-- could not find any active supporters because although supporters belong team
    -- but their status may be 'Inactive'
    if not exists(	select *
					from _activeSupportersBelongTeam a
					) then
                
		-- let supporter assigns ticket to a certain supporter manually
		set assigneeid = null;
		
		-- set ticket status = 1('Open')
		set ticketStatusid = 1;
		
		-- save ticket into the 'ticket' table
		insert into `ticket`(subject, categoryid, creatorid, teamid, priorityid, 
							assigneeid, ticketStatusid, 
							content, customFilename, createDatetime, lastUpdateDatetime,
							lastUpdateByUserid) values
							
							(in_subject, in_categoryid, in_creatorid, in_teamid, in_priorityid, 
							assigneeid, ticketStatusid,
							in_content, in_customFilename, now(), now(),
							creatorid); 
				 
		-- exit store procedure
		leave sp;
    
	end if;

	-- -------------------------------------------------
	-- Case 3: creator is also a supporter
	-- -->
	-- - assigneeid = in_creatorid
	-- - ticketStatusid = 'Assigned'
	-- -------------------------------------------------

	-- if creator is also a supporter then assign assignee to that supporter(creator)
    if exists(	select *
				from _activeSupportersBelongTeam a
                where a.supporterid = in_creatorid) then
		
        -- assign assignee to creator(is also supporter)
        set assigneeid = in_creatorid;
        
		-- set ticket status = 2('Assigned')
		set ticketStatusid = 2;
    
		-- save ticket into the 'ticket' table
		insert into `ticket`(subject, categoryid, creatorid, teamid, priorityid, 
							assigneeid, ticketStatusid, 
							content, customFilename, createDatetime, lastUpdateDatetime,
                            lastUpdateByUserid) values
                            
							(in_subject, in_categoryid, in_creatorid, in_teamid, in_priorityid, 
							assigneeid, ticketStatusid,
							in_content, in_customFilename, now(), now(),
                            creatorid);
                            
		-- exit store procedure
		leave sp;
                            
    end if; -- end of check exists
    
	-- ----------------------------------------------------------------------------
	-- Case 4: assign ticket to supporter who has at least tickets in team on current date
	-- -->
	-- - assigneeid = (supporter has at least tickets in team)
	-- - ticketStatusid = 'Assigned'
    --
    -- note: in case a supporter belongs to multi teams then we only count tickets belong
    -- 		to team that customer logged ticket to.
	-- ----------------------------------------------------------------------------  

	-- get minimum of tickets belong to specific team
	set minNumOfTickets = (	select min(numOfTickets) 
							from _activeSupportersBelongTeam a
							);

	-- drop the temporary "_activeSupporters_min_numOfTicket" table if it exists
	drop temporary table if exists _activeSupporters_min_numOfTicket;

    -- get active supporters who have the same at least number of tickets on current date
	create temporary table _activeSupporters_min_numOfTicket
	select 	a.supporterid,
			a.numOfTickets
	from _activeSupportersBelongTeam a
	where a.numOfTickets = minNumOfTickets;

	-- get only 1 supporter who has at least tickets in specific team on current date.
	-- in case there are many supporters who have the same at least tickets 
	-- then get random 1 supporter of them
	set assigneeid = (	select a.supporterid
						from _activeSupporters_min_numOfTicket a
						order by rand()
						limit 1
						);

	-- set ticket status = 2('Assigned')
	set ticketStatusid = 2;
        
	-- save ticket into the 'ticket' table
	insert into `ticket`(subject, categoryid, creatorid, teamid, priorityid, 
						assigneeid, ticketStatusid, 
						content, customFilename, createDatetime, lastUpdateDatetime,
						lastUpdateByUserid) values
						
						(in_subject, in_categoryid, in_creatorid, in_teamid, in_priorityid, 
						assigneeid, ticketStatusid,
						in_content, in_customFilename, now(), now(),
						creatorid);
         
	-- exit store procedure
	leave sp;
        
end if;

end $$

delimiter ;