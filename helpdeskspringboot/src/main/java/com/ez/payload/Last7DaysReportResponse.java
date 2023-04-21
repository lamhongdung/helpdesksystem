package com.ez.payload;

public interface Last7DaysReportResponse {

    // "dayMonth" column.
    // ex: Fri-21/4
    String getDayMonth();

    // "numOfNewTickets" column
    long getNumOfNewTickets();

    // "numOfSolvedTickets" column
    long getNumOfSolvedTickets();

    // "numOfClosedTickets" column
    long getNumOfClosedTickets();

    // "totalSpentHour" column
    float getTotalSpentHour();

}
