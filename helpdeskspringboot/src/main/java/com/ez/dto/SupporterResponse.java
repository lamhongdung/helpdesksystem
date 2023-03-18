package com.ez.dto;

// use interface instead of class because method getActiveSupporters()
// (in TeamRepository with "nativeQuery = true")
// did not recognize class fields
// error message(if we use class): No converter found capable of converting from type [org.springframework.data.jpa.repository.query.AbstractJpaQuery$TupleConverter$TupleBackedMap]
public interface SupporterResponse {

    // the "id" column
    Long getId();

    // the "description" column
    // decription = id + fullname(lastName + firstName) + email + status
    String getDescription();

}
