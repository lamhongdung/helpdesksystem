package com.ez.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class Supporter {

    // supporter id
    long id;

    // description = id + fullname(lastName + firstName) + email + status
    String description;

}