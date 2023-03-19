package com.ez.dto;

// contain data for display table in the "Team list" screen.
public interface TeamResponse {

    // "id" column
    Long getId();

    // "name" column
    String getName();

    // "assignmentMethod" column
    String getAssignmentMethod();

//    // "calendarid" column
//    long getCalendarid();
//
//    // "calendarName" column
//    String getCalendarName();

    // "status" column
    String getStatus();

}
