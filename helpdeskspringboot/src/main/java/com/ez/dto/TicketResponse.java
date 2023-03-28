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
    float getSpendHour();

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

    // "resolveIn" column
    String getResolveIn();

    // "currentTime" column
    Date getCurrentTime();

}
