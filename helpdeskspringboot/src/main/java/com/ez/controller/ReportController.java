package com.ez.controller;

import com.ez.payload.*;
import com.ez.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class ReportController {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private ReportService reportService;

    // get 'workload report' based on the filter criteria
    // for loading report in table in the "Workload report" screen.
    //
    @GetMapping("/report-workload")
    // only the ROLE_SUPPORTER or ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<WorkloadReportResponse>> viewWorkloadReport(@RequestParam long pageNumber,
                                                                           @RequestParam long pageSize,
                                                                           @RequestParam String fromDate,
                                                                           @RequestParam String toDate,
                                                                           @RequestParam String teamid,
                                                                           @RequestParam String supporterid
    ) {

        // get total of tickets from fromDate to toDate of each [teamid, supporterid]
        List<WorkloadReportResponse> workloads =
                reportService.viewWorkloadReport(pageNumber, pageSize, fromDate, toDate, teamid, supporterid);

        return new ResponseEntity<>(workloads, OK);

    }

    //
    // calculate number of supporters(workloads) based on filter criteria.
    //
    @GetMapping("/total-of-workloads")
    // only the ROLE_SUPPORTER or ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfWorkloads(
            @RequestParam String fromDate,
            @RequestParam String toDate,
            @RequestParam String teamid,
            @RequestParam String supporterid) {

        // calculate number of supporters based on filter criteria.
        long totalOfWorkloads =
                reportService.getTotalOfWorkloads(fromDate, toDate, teamid, supporterid);

        return new ResponseEntity<>(totalOfWorkloads, HttpStatus.OK);

    }

    // get number of tickets between fromDate and toDate by user id and based on
    // team filter and group by [priority, team]
    //
    // all authenticated users can access this resource.
    @GetMapping("/report-sla-detail")
    public ResponseEntity<List<SlaReportDetail>> viewSlaReportDetail(@RequestParam long userid,
                                                                     @RequestParam long pageNumber,
                                                                     @RequestParam long pageSize,
                                                                     @RequestParam String fromDate,
                                                                     @RequestParam String toDate,
                                                                     @RequestParam String teamid
    ) {

        // get number of tickets between fromDate and toDate by user id and based on
        // team filter and group by [priority, team]
        List<SlaReportDetail> slaReportDetails =
                reportService.viewSlaReportDetail(userid, pageNumber, pageSize, fromDate, toDate, teamid);

        return new ResponseEntity<>(slaReportDetails, OK);
    }

    // get 'total of tickets', 'total of ontime tickets', 'total of lated tickets' and SLA percentage
    // by user id and based on filter criteria[fromDate, toDate, team]
    //
    // all authenticated users can access this resource.
    @GetMapping("/report-sla-header")
    public ResponseEntity<SlaReportHeader> viewSlaReportHeader(@RequestParam long userid,
                                                               @RequestParam String fromDate,
                                                               @RequestParam String toDate,
                                                               @RequestParam String teamid
    ) {

        // get 'total of tickets', 'total of ontime tickets',
        // 'total of lated tickets' and SLA percentage
        // by user id and based on filter criteria[fromDate, toDate, team]
        SlaReportHeader slaReportHeader =
                reportService.viewSlaReportHeader(userid, fromDate, toDate, teamid);

        return new ResponseEntity<>(slaReportHeader, OK);
    }

    // count total of SLA records by user id and based on filter criteria[team] for pagination.
    //
    // all authenticated users can access this resource.
    @GetMapping("/total-of-sla")
    public ResponseEntity<Long> getTotalOfSla(
            @RequestParam long userid,
            @RequestParam String fromDate,
            @RequestParam String toDate,
            @RequestParam String teamid) {

        // count total of SLA records by user id and based on filter criteria[team] for pagination
        long totalOfSla =
                reportService.getTotalOfSla(userid, fromDate, toDate, teamid);

        return new ResponseEntity<>(totalOfSla, HttpStatus.OK);

    }

    // get number of new tickets 'last 7 days' by user id
    //
    // all authenticated users can access this resource.
    @GetMapping("/report-last7days")
    public ResponseEntity<List<Last7DaysReportResponse>> viewLast7DaysReport(
            @RequestParam long userid,
            @RequestParam String reportDate
    ) {

        // get number of new tickets 'last 7 days' by user id
        List<Last7DaysReportResponse> last7DaysReport =
                reportService.viewLast7DaysReport(userid, reportDate);

        return new ResponseEntity<>(last7DaysReport, OK);
    }

}
