package com.ez.payload;

// contain data for display table in the "Team list" screen.
public interface TeamResponse {

    // "id" column
    public Long getId();

    // "name" column
    public String getName();

    // "assignmentMethod" column
    public String getAssignmentMethod();

    // "status" column
    public String getStatus();

}
