package com.ez.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class SupporterDTO {

    // supporter id
    long id;

    // fullname(lastName + firstName) + email
    String fullnameEmail;

}
