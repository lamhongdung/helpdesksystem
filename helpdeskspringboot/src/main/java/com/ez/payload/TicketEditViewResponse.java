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

    // "spentDayHhmm + SLA" column.
    // ex: spentHour = "5 hours 41 minutes  --> Ontime"
    String getSpentHour();

    // "priorityid" column
    long getPriorityid();
    // "priority id + priority name + resolveIn + hours" column
    String getPriority();

    // "categoryid" column
    long getCategoryid();
    // "category id + category name" column
    String getCategory();

    // "assigneeid" column
    long getAssigneeid();
    // "supporter id + fullname" column
    String getAssignee();

    // "ticketStatusid" column
    long getTicketStatusid();
    // "ticketStatusid + name" column
    String getTicketStatus();

    // "customFilename" column
    // - customFilename = "": if user did not attach file or
    //                          attached file size exceeds max allowed file size(>10MB)
    // - customFilename = timestamp + UUID + extension(ex: .jpg): if user has attached file
    // ex: customFilename = "20230405143231_3ed7c8ea-114e-4c1f-a3d3-8e5a439e9aff.jpg".
    String getCustomFilename();

    // "originalFilename" column.
    // ex: originalFilename = 'abc.png'
    String getOriginalFilename();

    // "currentDatetime" column
    Date getCurrentDatetime();

    // "resolveIn" column
    long getResolveIn();

    // "sla"(service level agreement) column
    String getSla();

    // "spentDayHhmm" column.
    // ex: spentDayHhmm = "3 days 5 hours 41 minutes"
    String getSpentDayHhmm();

}
