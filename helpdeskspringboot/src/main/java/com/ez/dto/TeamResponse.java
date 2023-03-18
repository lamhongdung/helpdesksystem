package com.ez.dto;

// contain data for display table in the "Team list" screen.
// The following columns has in the TeamResponse interface but has not in the Team class:
//  - teamName
//  - calendarName
public interface TeamResponse {

    // "id" column
    Long getId();

    // "teamName" column
    String getTeamName();

    // "assignmentMethod" column
    String getAssignmentMethod();

    // "calendarid" column
    long getCalendarid();

    // "calendarName" column
    String getCalendarName();

    // "status" column
    String getStatus();

}
