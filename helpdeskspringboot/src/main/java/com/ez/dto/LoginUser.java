package com.ez.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginUser {

//    @Email(regexp = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\\\.[a-z]{2,4}$", message = "Email is incorrect format")
    @Email(message = "Email is incorrect format")
    private String email;

    @NotBlank(message = "Password must have value")
    private String password;

}
