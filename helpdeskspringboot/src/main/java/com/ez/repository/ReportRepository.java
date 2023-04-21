package com.ez.repository;

import com.ez.entity.Ticket;
import com.ez.payload.Last7DaysReportResponse;
import com.ez.payload.SlaReportDetail;
import com.ez.payload.SlaReportHeader;
import com.ez.payload.WorkloadReportResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface ReportRepository extends JpaRepository<Ticket, Long> {

    // get number of tickets from fromDate to toDate of each [teamid, supporterid]
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
    public List<WorkloadReportResponse> viewWorkloadReport(@Param("pageNumber") long pageNumber,
                                                              @Param("pageSize") long pageSize,
                                                              @Param("fromDate") String fromDate,
                                                              @Param("toDate") String toDate,
                                                              @Param("teamid") String teamid,
                                                              @Param("supporterid") String supporterid
    );

    // calculate total of supporters based on filter criteria for pagination
    @Query(value = "" +
            " {call sp_getTotalOfWorkloads( " +
            "                             :fromDate, " +
            "                             :toDate, " +
            "                             :teamid, " +
            "                             :supporterid " +
            "                             )} "
            , nativeQuery = true)
    public long getTotalOfWorkloads(@Param("fromDate") String fromDate,
                                      @Param("toDate") String toDate,
                                      @Param("teamid") String teamid,
                                      @Param("supporterid") String supporterid);

    // get number of tickets between fromDate and toDate by user id and based on
    // team filter and group by [priority, team]
    @Query(value = "" +
            " {call sp_slaReportDetail( " +
            "                        :userid, " +
            "                        :pageNumber, " +
            "                        :pageSize, " +
            "                        :fromDate, " +
            "                        :toDate, " +
            "                        :teamid " +
            "                        )} "
            , nativeQuery = true)
    public List<SlaReportDetail> viewSlaReportDetail(@Param("userid") long userid,
                                                     @Param("pageNumber") long pageNumber,
                                                     @Param("pageSize") long pageSize,
                                                     @Param("fromDate") String fromDate,
                                                     @Param("toDate") String toDate,
                                                     @Param("teamid") String teamid
    );

    // get 'total of tickets', 'total of ontime tickets', 'total of lated tickets' and 'SLA percentage'
    // by user id and based on filter criteria[fromDate, toDate, team]
    @Query(value = "" +
            " {call sp_slaReportHeader( " +
            "                        :userid, " +
            "                        :fromDate, " +
            "                        :toDate, " +
            "                        :teamid " +
            "                        )} "
            , nativeQuery = true)
    public SlaReportHeader viewSlaReportHeader(@Param("userid") long userid,
                                                 @Param("fromDate") String fromDate,
                                                 @Param("toDate") String toDate,
                                                 @Param("teamid") String teamid
    );

    // count total of SLA records by user id and based on filter criteria for pagination
    @Query(value = "" +
            " {call sp_getTotalOfSla( " +
            "                             :userid, " +
            "                             :fromDate, " +
            "                             :toDate, " +
            "                             :teamid " +
            "                             )} "
            , nativeQuery = true)
    public long getTotalOfSla(@Param("userid") long userid,
                                @Param("fromDate") String fromDate,
                                @Param("toDate") String toDate,
                                @Param("teamid") String teamid);

    // get number of tickets between fromDate and toDate by user id and based on
    // team filter and group by [priority, team]
    @Query(value = "" +
            " {call sp_last7DaysReport( " +
            "                        :userid, " +
            "                        :reportDate " +
            "                        )} "
            , nativeQuery = true)
    public List<Last7DaysReportResponse> viewLast7DaysReport(@Param("userid") long userid,
                                                             @Param("reportDate") String fromDate
    );

}
