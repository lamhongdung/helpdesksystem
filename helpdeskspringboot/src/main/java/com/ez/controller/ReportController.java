package com.ez.controller;

import com.ez.payload.*;
import com.ez.service.ReportService;
import com.ez.service.TeamService;
import com.ez.service.TicketService;
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
    // all authenticated users can access this resource.
    @GetMapping("/report-workload")
    // only the ROLE_SUPPORTER or ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<WorkloadReportResponse>> viewReport(
                                                                    @RequestParam long pageNumber,
                                                                    @RequestParam long pageSize,
                                                                    @RequestParam String fromDate,
                                                                    @RequestParam String toDate,
                                                                    @RequestParam String teamid,
                                                                    @RequestParam String supporterid
    ) {

        // get tickets by userid(and by user role) and based on search criteria
        List<WorkloadReportResponse> workloads = reportService.viewReport(
                pageNumber, pageSize, fromDate,
                toDate, teamid, supporterid
        );

        return new ResponseEntity<>(workloads, OK);

    }

    //
    // calculate total of tickets based on the search criteria.
    // use this total of tickets value to calculate total pages for pagination.
    //
    // url: ex: /total-of-tickets?userid=20&searchTerm=&fromDate=2023-01-01&toDate=2023-03-28&categoryid=0&priorityid=0&creatorid=0&teamid=0&assigneeid=0&sla=&ticketStatusid=0
    //
    // all authenticated users can access this resource
    @GetMapping("/total-of-workloads")
    // only the ROLE_SUPPORTER or ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfWorkloads(
            @RequestParam String fromDate,
            @RequestParam String toDate,
            @RequestParam String teamid,
            @RequestParam String supporterid) {

//        // calculate total of tickets based on the search criteria
//        long totalOfWorkloads = reportService.getTotalOfWorkloads(fromDate, toDate,
//                teamid,
//                supporterid);

//        return new ResponseEntity<>(totalOfWorkloads, HttpStatus.OK);

        return null;
    }


}
