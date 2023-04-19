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
    public List<WorkloadReportResponse> viewReport(long pageNumber, long pageSize,
                                                   String fromDate, String toDate,
                                                   String teamid, String supporterid
    ) {

        LOGGER.info("get total of tickets from fromDate to toDate of each [teamid, supporterid]");

        return reportRepository.viewReport(pageNumber, pageSize, fromDate, toDate, teamid, supporterid);
    }

    // calculate number of supporters based on filter criteria
    public long getTotalOfWorkloads(String fromDate, String toDate, String teamid, String supporterid) {

        LOGGER.info("calculate number of supporters based on filter criteria");

        return reportRepository.getTotalOfWorkloads(fromDate, toDate, teamid, supporterid);

    }

}
