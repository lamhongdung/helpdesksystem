package com.ez.repository;

import com.ez.entity.Ticket;
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
    public List<WorkloadReportResponse> viewReport(@Param("pageNumber") long pageNumber,
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


}
