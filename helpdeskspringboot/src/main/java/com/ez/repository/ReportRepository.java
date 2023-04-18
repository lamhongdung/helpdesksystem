package com.ez.repository;

import com.ez.entity.Ticket;
import com.ez.payload.DropdownResponse;
import com.ez.payload.TicketEditViewResponse;
import com.ez.payload.TicketSearchResponse;
import com.ez.payload.WorkloadReportResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface ReportRepository extends JpaRepository<Ticket, Long> {

    // get tickets by user id, user role, and based on search criteria
    @Query(value = "" +
            " {call sp_workloadReport( " +
            "                        :pageNumber, " +
            "                        :pageSize, " +
            "                        :fromDate, " +
            "                        :toDate, " +
            "                        :teamid, " +
            "                        :supporterid " +
            "                        )} "
            , nativeQuery = true)
    public List<WorkloadReportResponse> viewReport(@Param("pageNumber") long pageNumber,
                                                              @Param("pageSize") long pageSize,
                                                              @Param("fromDate") String fromDate,
                                                              @Param("toDate") String toDate,
                                                              @Param("teamid") String teamid,
                                                              @Param("supporterid") String ticketStatusid
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

    // save ticket into the 'ticket' table
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

    // get ticket by ticketid.
    @Query(value = "" +
            " {call sp_getTicketById(:ticketid)} "
            , nativeQuery = true)
    public TicketEditViewResponse getTicketById(@Param("ticketid") long ticketid);

    // update ticket
    @Modifying
    @Query(value = "" +
            " update ticket a set   a.categoryid = :categoryid, " +
            "                       a.priorityid = :priorityid, " +
            "                       a.assigneeid = :assigneeid, " +
            "                       a.ticketStatusid = :ticketStatusid, " +
            "                       a.lastUpdateByUserid = :toBeUpdatedByUserid, " +
            "                       a.lastUpdateDatetime = now() " +
            " where a.ticketid = :ticketid "
            , nativeQuery = true)
    void updateTicket(@Param("ticketid") long ticketid,
                      @Param("categoryid") long categoryid,
                      @Param("priorityid") long priorityid,
                      @Param("assigneeid") long assigneeid,
                      @Param("ticketStatusid") long ticketStatusid,
                      @Param("toBeUpdatedByUserid") long toBeUpdatedByUserid);

}
