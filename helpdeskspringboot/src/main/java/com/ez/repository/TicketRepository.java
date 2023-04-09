package com.ez.repository;

import com.ez.dto.DropdownResponse;
import com.ez.dto.TicketResponse;
import com.ez.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // get all ticket status.
    // 5 status + 1 dummy status:
    //  - 0: All(dummy)
    //  - 1: Open
    //  - 2: Assigned
    //  - 3: Resolved
    //  - 4: Closed
    //  - 5: Cancel
    @Query(value = "" +
            " select 0 as id, 'All' as description " +
            "  " +
            " union all " +
            "  " +
            " select a.statusid as id, a.name as description " +
            " from ticketStatus a "
            , nativeQuery = true)
    public List<DropdownResponse> getAllTicketStatus();

    // get creators by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_getCreatorsByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getCreatorsByUserid(@Param("userid")  int userid);

    // get teams by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_getTeamsByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getTeamsByUserid(@Param("userid")  int userid);

    // get all active teams.
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "" +
            " select a.id as id, " + // team id
            "        concat(a.id, ' - ', a.name, ' - ', " +
            "                   case a.assignmentmethod " +
            "                       when 'A' then 'Auto' " +
            "                       else 'Manual' " +
            "                   end " +
            "               ) as description " +
            " from team a " +
            " where a.status = 'Active' "
            , nativeQuery = true)
    public List<DropdownResponse> getAllActiveTeams();

    // get assignees by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_getAssigneesByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getAssigneesByUserid(@Param("userid")  int userid);

    // get categories by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_getCategoriesByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getCategoriesByUserid(@Param("userid")  int userid);

    // get all active categories.
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "" +
            " select a.id as id, " + // category id
            "        concat(a.id, ' - ', a.name) as description " +
            " from category a " +
            " where a.status = 'Active' "
            , nativeQuery = true)
    public List<DropdownResponse> getAllActiveCategories();

    // get priorities by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_getPrioritiesByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getPrioritiesByUserid(@Param("userid")  int userid);

    // get all active prorities.
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "" +
            " select a.id as id, " + // priority id
            "        concat(a.id, ' - ', a.name, ' - ', a.resolveIn, ' hours') as description " +
            " from priority a " +
            " where a.status = 'Active' "
            , nativeQuery = true)
    public List<DropdownResponse> getAllActivePriorities();

    // get tickets by user id, user role, and based on search criteria
    @Query(value = "" +
            " {call sp_searchTickets( " +
            "                        :userid, " +
            "                        :pageNumber, " +
            "                        :pageSize, " +
            "                        :searchTerm, " +
            "                        :fromDate, " +
            "                        :toDate, " +
            "                        :categoryid, " +
            "                        :priorityid, " +
            "                        :creatorid, " +
            "                        :teamid, " +
            "                        :assigneeid, " +
            "                        :sla, " +
            "                        :ticketStatusid " +
            "                        )} "
            , nativeQuery = true)
    public List<TicketResponse> searchTicketsByUserid(@Param("userid") long userid,
                                                      @Param("pageNumber") long pageNumber,
                                                      @Param("pageSize") long pageSize,
                                                      @Param("searchTerm") String searchTerm,
                                                      @Param("fromDate") String fromDate,
                                                      @Param("toDate") String toDate,
                                                      @Param("categoryid") String categoryid,
                                                      @Param("priorityid") String priorityid,
                                                      @Param("creatorid") String creatorid,
                                                      @Param("teamid") String teamid,
                                                      @Param("assigneeid") String assigneeid,
                                                      @Param("sla") String sla,
                                                      @Param("ticketStatusid") String ticketStatusid
                                                      );

    // calculate total of tickets based on search criteria for pagination
    @Query(value = "" +
            " {call sp_getTotalOfTickets( " +
            "                             :userid, " +
            "                             :searchTerm, " +
            "                             :fromDate, " +
            "                             :toDate, " +
            "                             :categoryid, " +
            "                             :priorityid, " +
            "                             :creatorid, " +
            "                             :teamid, " +
            "                             :assigneeid, " +
            "                             :sla, " +
            "                             :ticketStatusid " +
            "                             )} "
            , nativeQuery = true)
    public long getTotalOfTickets(@Param("userid") long userid,
                                  @Param("searchTerm") String searchTerm,
                                  @Param("fromDate") String fromDate,
                                  @Param("toDate") String toDate,
                                  @Param("categoryid") String categoryid,
                                  @Param("priorityid") String priorityid,
                                  @Param("creatorid") String creatorid,
                                  @Param("teamid") String teamid,
                                  @Param("assigneeid") String assigneeid,
                                  @Param("sla") String sla,
                                  @Param("ticketStatusid") String ticketStatusid);

    // save ticket into 'ticket' table
    @Modifying
    @Query(value = "" +
            " {call sp_saveTicket( " +
            "                             :creatorid, " +
            "                             :subject, " +
            "                             :content, " +
            "                             :teamid, " +
            "                             :categoryid, " +
            "                             :priorityid, " +
            "                             :customFilename " +
            "                             )} "
            , nativeQuery = true)
    public void saveTicket(@Param("creatorid") long creatorid,
                              @Param("subject") String subject,
                              @Param("content") String content,
                              @Param("teamid") long teamid,
                              @Param("categoryid") long categoryid,
                              @Param("priorityid") long priorityid,
                              @Param("customFilename") String customFilename);


}
