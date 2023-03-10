package com.ez.dto;

import lombok.*;

import javax.persistence.Entity;

// use interface instead of class because method getActiveSupporters()
// (in TeamRepository with "nativeQuery = true")
// did not recognize class fields
public interface Supporter {

    // spring boot auto understand as the "id" column
    Long getId();

    // spring boot auto understand as the "fullnameEmail" column
    // (fullname(lastName + firstName) + email)
    String getFullnameEmail();

}
