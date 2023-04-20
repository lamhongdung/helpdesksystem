package com.ez.payload;

public interface SlaReportHeader {

    // "numOfTickets" column.
    // number of tickets between fromDate toDate, and based on team filter.
    long getNumOfTickets();

    // "numOfOntimeTickets" column.
    // number of ontime tickets between fromDate toDate, and based on team filter.
    long getNumOfOntimeTickets();

    // "numOfLatedTickets" column.
    // number of lated tickets between fromDate toDate, and based on team filter.
    long getNumOfLatedTickets();

    // "SlaPercent" column(SLA percentage) = (numOfOntimeTickets/numOfTickets)
    float getSlaPercent();
}
