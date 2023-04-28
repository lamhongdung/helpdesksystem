package com.ez.payload;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class Supporter {

    // supporter id
    private long id;

    // description = id + fullname(lastName + firstName) + email + status
    private String description;

}
