package com.ez.exception;

// exception for id or email has not found
public class ResourceNotFoundException extends Exception {

    public ResourceNotFoundException(String message) {
        super(message);
    }

}

