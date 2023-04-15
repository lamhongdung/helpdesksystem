package com.ez.service;

import com.ez.payload.ChangePassword;
import com.ez.payload.EditProfile;
import com.ez.exception.*;
import com.ez.entity.User;

import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import java.util.List;

public interface UserService {

    // find user by user id
    public User findById(Long id) throws EntityNotFoundException;

    // search users by pageNumber and based on the search criteria.
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size
    //  - searchTerm: ID, email, firstName, lastName, phone
    //  - role: '', 'ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN'
    //  - status: '', 'Active', 'Inactive'
    public List<User> searchUsers(int pageNumber, int pageSize, String searchTerm, String role, String status);

    // find user by email
    public User findUserByEmail(String email);

    // check whether user is inactive or not?
    // return:
    //  - not null: inactive user
    //  - null: not inactive user
    public User isInactiveUser(String email) throws BadDataException;

    // calculate total of users based on the search criteria.
    // based on this total of users we can calculate total pages
    public long getTotalOfUsers(String searchTerm, String role, String status);

    // create new user
    public User createUser(User user) throws MessagingException, BadDataException;

    // update existing user
    public User updateUser(User user) throws MessagingException, BadDataException, EntityNotFoundException;

    // update user profile
    public User updateProfile(EditProfile editProfile) throws MessagingException, EntityNotFoundException;

    // reset password in case user forgot his/her password
    public void resetPassword(String email) throws MessagingException, EntityNotFoundException;

    // change password
    public void changePassword(ChangePassword changePassword) throws MessagingException, EntityNotFoundException, BadDataException, BadDataException;

}
