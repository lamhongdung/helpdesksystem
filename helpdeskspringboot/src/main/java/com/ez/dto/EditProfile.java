package com.ez.dto;

import lombok.*;

import javax.validation.constraints.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class EditProfile {

    @Min(1)
    private Long id;

    @NotBlank(message = "Email must have value")
    @Email(message = "Email is incorrect format")
    private String email;

    @Size(min = 1, max = 50, message="Length of the first name must be between 1 and 50 characters")
    private String firstName;

    @Size(min = 1, max = 50, message="Length of last name must be between 1 and 50 characters")
    private String lastName;

    @Pattern(regexp = "^[0-9]{10}$", message="Phone number must be 10 digits length")
    private String phone;
    @Size(max = 100, message="Address cannot be longer than 100 characters")
    private String address;

}
