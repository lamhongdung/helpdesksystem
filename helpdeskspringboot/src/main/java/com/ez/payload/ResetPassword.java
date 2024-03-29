package com.ez.payload;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class ResetPassword {

    @NotBlank(message = "Please input an email")
    @Email(message = "Email is incorrect format")
    private String email;

}
