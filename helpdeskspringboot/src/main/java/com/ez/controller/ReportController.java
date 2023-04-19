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
    ReportService reportService;

    // get 'workload report' based on the filter criteria
    // for loading report in table in the "Workload report" screen.
    //
    @GetMapping("/report-workload")
    // only the ROLE_SUPPORTER or ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<WorkloadReportResponse>> viewReport(@RequestParam long pageNumber,
                                                                   @RequestParam long pageSize,
                                                                   @RequestParam String fromDate,
                                                                   @RequestParam String toDate,
                                                                   @RequestParam String teamid,
                                                                   @RequestParam String supporterid
    ) {

        // get total of tickets from fromDate to toDate of each [teamid, supporterid]
        List<WorkloadReportResponse> workloads =
                reportService.viewReport(pageNumber, pageSize, fromDate, toDate, teamid, supporterid);

        return new ResponseEntity<>(workloads, OK);

    }

    //
    // calculate number of supporters based on filter criteria.
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


}
