package com.ez.payload;

public interface WorkloadReportResponse {

    // "team" column = team id + team name + assignment method
    String getTeam();

    // "supporter" column = supporter id + fullname
    String getSupporter();

    // "supporterStatus" column = Active / Inactive
    String getSupporterStatus();

    // "numOfTickets" column.
    // total of tickets from fromDate to toDate of each [teamid, supporterid]
    long getNumOfTickets();

}
