package com.ez.payload;

import java.util.Date;

public interface TicketSearchResponse {

    // "ticketid" column
    public Long getTicketid();

    // "subject" column
    public String getSubject();

    // "creatorName" column
    public String getCreatorName();

    // "assigneeName" column
    public String getAssigneeName();

    // "createDatetime" column
    public Date getCreateDatetime();

    // "ticketStatusName" column
    public String getTicketStatusName();

    // "sla" column
    public String getSla();

    // "lastUpdateDatetime" column
    public Date getLastUpdateDatetime();

    // "spentHour" column
    // ex: 1.5 (hours)
    public float getSpentHour();

    // -- count spent 'days-hours-minutes'.
    // ex: spentDayHhmm = '3 days 15 hours 22 minutes'
    public String getSpentDayHhmm();

    // "creatorPhone" column
    public String getCreatorPhone();

    // "creatorEmail" column
    public String getCreatorEmail();

    // "teamName" column
    public String getTeamName();

    // "categoryName" column
    public String getCategoryName();

    // "priorityName" column
    public String getPriorityName();

    // "content" column
    public String getContent();

    // "resolveIn" column.
    // limit hours to resolve a ticket
    public String getResolveIn();

    // "currentDatetime" column
    public Date getCurrentDatetime();

    // "ticketStatusid" column
    public long getTicketStatusid();

}
