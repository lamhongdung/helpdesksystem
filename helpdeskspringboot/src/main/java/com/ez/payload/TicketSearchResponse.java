package com.ez.payload;

import java.util.Date;

public interface TicketSearchResponse {

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

    // "spentHour" column
    // ex: 1.5 hours
    float getSpentHour();

    // -- count spent 'days-hours-minutes'.
    // ex: spentDayHhmm = '3 days 15 hours 22 minutes'
    String getSpentDayHhmm();

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
