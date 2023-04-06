package com.ez.dto;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class ChangePassword {

    @NotBlank(message = "Please input an email")
    @Email(message = "Email is incorrect format")
    private String email;

    @NotBlank(message = "Please input old password")
    private String oldPassword;
    @NotBlank(message = "Please input new password")
    private String newPassword;
    @NotBlank(message = "Please input Confirm new password")
    private String confirmNewPassword;

}
