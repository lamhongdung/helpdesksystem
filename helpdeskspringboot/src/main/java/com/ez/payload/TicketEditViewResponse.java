package com.ez.payload;

import java.util.Date;

public interface TicketEditViewResponse {

    // "ticketid" column
    Long getTicketid();

    // "creator id + creator fullname" column
    String getCreator();

    // "creatorPhone" column
    String getCreatorPhone();

    // "creatorEmail" column
    String getCreatorEmail();

    // "subject" column
    String getSubject();

    // "content" column
    String getContent();


    // "team id + team name" column
    String getTeam();

    // "createDatetime" column
    Date getCreateDatetime();

    // "lastUpdateDatetime" column
    Date getLastUpdateDatetime();

    // "last update by user id + fullname" column
    String getLastUpdateByUser();

    // "spentHourHhmmss + SLA" column
    String getSpentHour();

    // "categoryid" column
    String getCategoryid();

    // "priorityid" column
    String getPriorityid();

    // "assigneeid" column
    String getAssigneeid();

    // "ticketStatusid" column
    String getTicketStatusid();

    // custom filename
    String getCustomFilename();

    String getOriginalFilename();

    // "currentDatetime" column
    Date getCurrentDatetime();

    String getResolveIn();

    String getSla();
}
