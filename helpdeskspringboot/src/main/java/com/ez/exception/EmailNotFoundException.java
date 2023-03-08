package com.ez.exception;

// exception for email has not found(function of update user)
public class EmailNotFoundException extends Exception {
    public EmailNotFoundException(String message) {
        super(message);
    }
}
