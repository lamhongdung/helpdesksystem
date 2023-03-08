package com.ez.exception;

public class NewPasswordIsNotMatchException extends Exception{
    public NewPasswordIsNotMatchException(String message) {
        super(message);
    }
}

