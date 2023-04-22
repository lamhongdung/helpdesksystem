package com.ez.payload;

// contain data for display table in the "Team list" screen.
public interface TeamResponse {

    // "id" column
    Long getId();

    // "name" column
    String getName();

    // "assignmentMethod" column
    String getAssignmentMethod();

    // "status" column
    String getStatus();

}
