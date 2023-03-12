package com.ez.dto;

import lombok.*;

import javax.persistence.Entity;

// use interface instead of class because method getActiveSupporters()
// (in TeamRepository with "nativeQuery = true")
// did not recognize class fields
// error message(if we use class): No converter found capable of converting from type [org.springframework.data.jpa.repository.query.AbstractJpaQuery$TupleConverter$TupleBackedMap]
public interface Supporter {

    // spring boot auto understand as the "id" column
    Long getId();

    // spring boot auto understand as the "idFullnameEmail" column
    // id + fullname(lastName + firstName) + email
    String getIdFullnameEmail();

}
