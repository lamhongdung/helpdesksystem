package com.ez.repository;

import com.ez.dto.DropdownResponse;
import com.ez.dto.TicketResponse;
import com.ez.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
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
    //  - All(dummy)
    //  - Open
    //  - Cancel
    //  - Assigned
    //  - Resolved
    //  - Closed
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

    // get priorities by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_getPrioritiesByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getPrioritiesByUserid(@Param("userid")  int userid);

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

    // calculate total of tickets for pagination
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

}
