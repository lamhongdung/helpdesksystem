package com.ez.dto;

import lombok.*;

import javax.validation.constraints.*;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
// this class contains data is sent from client when creating team.
// TeamRequest = Team + supporters.
public class TeamRequest {

    private Long id;

    @Size(min = 1, max = 50, message = "Length of the team name must be between 1 and 50 characters")
    private String name;

    @Pattern(regexp = "A|M", message = "Value of the assignment method must be 'A' or 'M'")
    private String assignmentMethod;

//    @Min(value = 1, message = "Value of calendarid must be greater than or equal to 1")
//    private long calendarid;

    @Size(min = 1, message = "Team must have at least 1 supporter")
    private List<Supporter> supporters;

    @Pattern(regexp = "Active|Inactive", message = "Value of the status must be 'Active' or 'Inactive'")
    private String status;

}
