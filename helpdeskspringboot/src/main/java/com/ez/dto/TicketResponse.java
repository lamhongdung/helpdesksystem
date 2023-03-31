package com.ez.dto;

import java.util.Date;

public interface TicketResponse {

    // "ticketid" column
    Long getTicketid();

    // "subject" column
    String getSubject();

    // "creatorName" column
    String getCreatorName();

    // "assigneeName" column
    String getAssigneeName();

    // "createDatetime" column
    Date getCreateDatetime();

    // "ticketStatusName" column
    String getTicketStatusName();

    // "sla" column
    String getSla();

    // "lastUpdateDatetime" column
    Date getLastUpdateDatetime();

    // "spendHour" column
    // ex: 1.5 hours
    float getSpendHour();

    // "spendHourHhmmss" column
    // hours in hh:mm:ss(ex: 01:30:00)
    String getSpendHourHhmmss();

    // "creatorPhone" column
    String getCreatorPhone();

    // "creatorEmail" column
    String getCreatorEmail();

    // "teamName" column
    String getTeamName();

    // "categoryName" column
    String getCategoryName();

    // "priorityName" column
    String getPriorityName();

    // "content" column
    String getContent();

    // "resolveIn" column.
    // limit hours to resolve a ticket
    String getResolveIn();

    // "currentDatetime" column
    Date getCurrentDatetime();

    // "ticketStatusid" column
    long getTicketStatusid();

}
