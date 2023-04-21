package com.ez.service;

import com.ez.payload.*;
import com.ez.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private ReportRepository reportRepository;

    // get number of tickets from fromDate to toDate of each [teamid, supporterid]
    public List<WorkloadReportResponse> viewWorkloadReport(long pageNumber, long pageSize,
                                                           String fromDate, String toDate,
                                                           String teamid, String supporterid
    ) {

        LOGGER.info("get total of tickets from fromDate to toDate of each [teamid, supporterid]");

        return reportRepository.viewWorkloadReport(pageNumber, pageSize, fromDate, toDate, teamid, supporterid);
    }

    // calculate number of supporters based on filter criteria
    public long getTotalOfWorkloads(String fromDate, String toDate, String teamid, String supporterid) {

        LOGGER.info("calculate number of supporters based on filter criteria");

        return reportRepository.getTotalOfWorkloads(fromDate, toDate, teamid, supporterid);

    }

    // get number of tickets between fromDate and toDate by user id and based on
    // team filter and group by [priority, team]
    public List<SlaReportDetail> viewSlaReportDetail(long userid, long pageNumber, long pageSize,
                                                     String fromDate, String toDate, String teamid
    ) {

        LOGGER.info("get number of tickets between fromDate and toDate by user id and based on");
        LOGGER.info("team filter and group by [priority, team]");

        return reportRepository.viewSlaReportDetail(userid, pageNumber, pageSize, fromDate, toDate, teamid);
    }

    // get 'total of tickets', 'total of ontime tickets', 'total of lated tickets' and SLA percentage
    // by user id and based on filter criteria[fromDate, toDate, team]
    public SlaReportHeader viewSlaReportHeader(
            long userid, String fromDate, String toDate, String teamid
    ) {

        LOGGER.info("get 'total of tickets', 'total of ontime tickets', 'total of lated tickets' and 'SLA percentage'");
        LOGGER.info("by user id and based on filter criteria[fromDate, toDate, team]");

        return reportRepository.viewSlaReportHeader(userid, fromDate, toDate, teamid);
    }

    // count total of SLA records by user id and based on filter criteria[team] for pagination
    public long getTotalOfSla(long userid, String fromDate, String toDate, String teamid) {

        LOGGER.info("count total of SLA records by user id and based on filter criteria[team] for pagination");

        return reportRepository.getTotalOfSla(userid, fromDate, toDate, teamid);
    }

    // get number of tickets between fromDate and toDate by user id and based on
    // team filter and group by [priority, team]
    public List<Last7DaysReportResponse> viewLast7DaysReport(
            long userid, String reportDate
    ) {

        LOGGER.info("get number of tickets between fromDate and toDate by user id and based on");
        LOGGER.info("team filter and group by [priority, team]");

        return reportRepository.viewLast7DaysReport(userid, reportDate);
    }

}
