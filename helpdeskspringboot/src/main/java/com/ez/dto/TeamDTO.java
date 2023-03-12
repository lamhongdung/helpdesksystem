package com.ez.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.List;

// this class contains data is sent from client when creating team
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class TeamDTO {

//    @Size(min = 1, message = "ID value must be greater than or equal to 1")
    private Long id;

    @Size(min = 1, max = 50, message = "Length of the team name must be between 1 and 50 characters")
    private String name;

    //    @Pattern(regexp = "^[AM]$", message = "Value of assignment method must be 'A' or 'M'")
    @Pattern(regexp = "A|M", message = "Value of the assignment method must be 'A' or 'M'")
    private String assignmentMethod;

    @Size(min = 1, message = "Team must have at least 1 supporter")
    private List<SupporterDTO> supporters;

    @Pattern(regexp = "Active|Inactive", message = "Value of the status must be 'Active' or 'Inactive'")
    private String status;

}
