package com.ez.constant;

public class Constant {

    //
    // security constants
    //
    public static final long EXPIRATION_TIME = 432_000_000; // 5 days expressed in milliseconds
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String JWT_TOKEN_HEADER = "Jwt-Token";
    public static final String TOKEN_CANNOT_BE_VERIFIED = "Token cannot be verified";

    public static final String HELP_DESK = "Hesp Desk";
    public static final String HELP_DESK_ADMINISTRATION = "Help Desk System";
    public static final String AUTHORITIES = "authorities";
    public static final String FORBIDDEN_MESSAGE = "You need to log in to access this page";
    public static final String ACCESS_DENIED_MESSAGE = "You do not have permission to access this page";
    public static final String OPTIONS_HTTP_METHOD = "OPTIONS";

    public static final String[] PUBLIC_URLS = { "/login", "/reset-password"};
//    public static final String[] PUBLIC_URLS = { "**" };

    //
    // email constants
    //
    public static final String EMAIL_SUBJECT_CREATE_NEW_USER = "Help Desk System - New account";
    public static final String EMAIL_SUBJECT_RESET_PASSWORD = "Help Desk System - Reset password";

    //
    // user constants
    //
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists. Please choose another email.";
    public static final String USER_IS_INACTIVE = "User is inactive. Please contact administrator for help.";
    public static final String FOUND_USER_BY_EMAIL = "Found user by email: ";
    public static final String NO_USER_FOUND_BY_EMAIL = "No user found for email: ";
    public static final String NEW_PASSWORD_IS_NOT_MATCH = "New password is not match with Confirm new password. Please try again.";
    public static final String NO_USER_FOUND_BY_ID = "No user found for id: ";

    //
    // category constants
    //
    public static final String NO_CATEGORY_FOUND_BY_ID = "No category found for id: ";

    //
    // priority constants
    //
    public static final String NO_PRIORITY_FOUND_BY_ID = "No priority found for id: ";

}
