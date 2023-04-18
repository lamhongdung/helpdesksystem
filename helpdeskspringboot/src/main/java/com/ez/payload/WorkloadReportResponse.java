package com.ez.payload;

public interface WorkloadReportResponse {

    // "team" column = team id + team name + assignment method
    String getTeam();

    // "supporter" column = supporter id + fullname + status
    String getSupporter();

    // "numOfTickets" column
    long getNumOfTickets();

}
