package com.ez.payload;

public interface SlaReportDetail {

    // "priority" column = priority id + name + resolved(hours)
    String getPriority();

    // "team" column = team id + name
    String getTeam();

    // "numOfTickets" column.
    // number of tickets between fromDate toDate, and based on [priorityid, teamid].
    long getNumOfTickets();

    // "numOfOntimeTickets" column.
    // number of ontime tickets between fromDate toDate, and based on [priorityid, teamid].
    long getNumOfOntimeTickets();

    // "numOfLatedTickets" column.
    // number of lated tickets between fromDate toDate, and based on [priorityid, teamid].
    long getNumOfLatedTickets();

    // "SlaPercent" column(SLA percentage) = (numOfOntimeTickets/numOfTickets)
    float getSlaPercent();

}
