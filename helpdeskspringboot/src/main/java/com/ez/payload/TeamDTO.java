package com.ez.payload;

import lombok.*;

import javax.validation.constraints.*;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
// TeamDTO = Team + supporters.
public class TeamDTO {

    private Long id;

    @Size(min = 1, max = 50, message = "Length of the team name must be between 1 and 50 characters")
    private String name;

    @Pattern(regexp = "A|M", message = "Value of the assignment method must be 'A' or 'M'")
    private String assignmentMethod;

    @Size(min = 1, message = "Team must have at least 1 supporter")
    private List<Supporter> supporters;

    @Pattern(regexp = "Active|Inactive", message = "Value of the status must be 'Active' or 'Inactive'")
    private String status;

}
