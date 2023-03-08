package com.ez.exception;

public class OldPasswordIsNotMatchException extends Exception{
    public OldPasswordIsNotMatchException(String message) {
        super(message);
    }
}