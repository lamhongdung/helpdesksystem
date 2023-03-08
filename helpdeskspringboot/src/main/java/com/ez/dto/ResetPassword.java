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
public class ResetPassword {

    @NotBlank(message = "Please input an email")
    @Email(message = "Email is incorrect format")
    private String email;

}
