package com.ez.service.impl;

import com.ez.dto.ChangePassword;
import com.ez.dto.EditProfile;
import com.ez.entity.*;
import com.ez.exception.*;
import com.ez.repository.UserRepository;
import com.ez.service.EmailService;
import com.ez.service.UserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

import static com.ez.constant.Constant.*;

@Service
@Transactional
@Qualifier("userDetailsService")
public class UserServiceImpl implements UserService, UserDetailsService {

    // getClass() = UserServiceImpl.class
    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // get user info by email
    @Override
    public UserDetails loadUserByUsername(String email) {
        LOGGER.info("load user by email");

        // get user by email
        User user = userRepository.findUserByEmail(email);

        // not found user by email
        if (user == null) {
            LOGGER.error(NO_USER_FOUND_BY_EMAIL + email);
            try {
                throw new ResourceNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
            } catch (ResourceNotFoundException e) {
                throw new RuntimeException(e);
            }
        } else { // found user by email

            UserPrincipal userPrincipal = new UserPrincipal(user);

            LOGGER.info(FOUND_USER_BY_EMAIL + email);
            return userPrincipal;
        }
    }

    // find user by id
    @Override
    public User findById(Long id) throws ResourceNotFoundException {

        LOGGER.info("find user by id");

        // find user by user id
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(NO_USER_FOUND_BY_ID + id));
    }

    // reset password in case user forgot his/her password
    @Override
    public void resetPassword(String email) throws ResourceNotFoundException {

        LOGGER.info("Reset password");

        // list of receiver emails
        List<String> recipients = new ArrayList<>();

        // use StringBuilder instead of String to save memory
        StringBuilder emailBody = new StringBuilder();

        // find user by email
        LOGGER.info("find user by email.");
        User user = userRepository.findUserByEmail(email);

        LOGGER.info("Validate data");

        // if email has not found in the database
        if (user == null) {

            LOGGER.info("No user found for email: " + email);

            throw new ResourceNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
        }

        //
        // found user by email in the database
        //

        // generate new random password
        String password = generatePassword();

        // set new random password to user
        user.setPassword(encodePassword(password));

        // save new password into the database
        userRepository.save(user);

        LOGGER.info("Send email to inform reset password.");

        // email body
        emailBody.append("Hello " + user.getLastName() + " " + user.getFirstName() + ",\n\n");
        emailBody.append("Your password was reset." + "\n\n");
        emailBody.append("Use the following information to access the Help Desk system:\n\n");
        emailBody.append("- Email: " + user.getEmail() + "\n");
        emailBody.append("- New password: " + password + "\n\n");
        emailBody.append("The Help Desk Team");

        LOGGER.info("Reset password. New password is: " + password);

        // add receivers
        recipients.add(email);

        emailService.sendEmail(EMAIL_SUBJECT_RESET_PASSWORD, emailBody.toString(), recipients);

    } // end of resetPassword()

    // change password
    @Override
    public void changePassword(ChangePassword changePassword) throws ResourceNotFoundException, OldPasswordIsNotMatchException, NewPasswordIsNotMatchException {

        // find user by email
        LOGGER.info("find user by email.");
        User user = userRepository.findUserByEmail(changePassword.getEmail());

        // if email has not found in the database
        if (user == null) {

            LOGGER.error("No user found for email: " + changePassword.getEmail());

            throw new ResourceNotFoundException(NO_USER_FOUND_BY_EMAIL + changePassword.getEmail());
        }

        // if old password is not match then throw an exception
        if (!passwordEncoder.matches(changePassword.getOldPassword(), user.getPassword())) {

            LOGGER.error("Old password for email " + changePassword.getEmail() + " is not match. Please try again.");

            throw new OldPasswordIsNotMatchException("Old password for email " + changePassword.getEmail() + " is not match. Please try again.");
        }

        // if "new password" is not match with "confirm new password" then throw an exception
        if (!StringUtils.equals(changePassword.getNewPassword(), changePassword.getConfirmNewPassword())) {

            LOGGER.error("New password is not match with Confirm new password. Please try again.");

            throw new NewPasswordIsNotMatchException(NEW_PASSWORD_IS_NOT_MATCH);
        }

        LOGGER.info("Change password");

        user.setPassword(encodePassword(changePassword.getNewPassword()));

        userRepository.save(user);

    }

    // search users by pageNumber and based on the search criteria
    @Override
    public List<User> searchUsers(int pageNumber, int pageSize, String searchTerm, String role, String status) {

        return userRepository.searchUsers(pageNumber, pageSize, searchTerm, role, status);

    }

    // find user by email
    @Override
    public User findUserByEmail(String email) {

        User user = userRepository.findUserByEmail(email);

        return user;
    }

    // check whether a user is inactive or not?
    // return:
    //  - not null: inactive user
    //  - null: not inactive user
    @Override
    public User isInactiveUser(String email) {

        User user = userRepository.isInactiveUser(email);

        return user;
    }

    // calculate total of users based on the search criteria
    @Override
    public long getTotalOfUsers(String searchTerm, String role, String status) {
        return userRepository.getTotalOfUsers(searchTerm, role, status);
    }

    // create new user
    @Override
    public User createUser(User user) throws EmailExistException {

        LOGGER.info("create new user");

        // list of receiver emails
        List<String> recipients = new ArrayList<>();

        // use StringBuilder instead of String to save memory
        StringBuilder emailBody = new StringBuilder();

        // random password
        String password;

        // new user
        User newUser = new User();

        // if email already existed then inform to user "Email already exists. Please choose another email."
        if (existEmail(user.getEmail())) {

            LOGGER.error("Email already exists. Please choose another email.");

            throw new EmailExistException(EMAIL_ALREADY_EXISTS);
        }

        // set email
        newUser.setEmail(user.getEmail());

        // generate random password
        password = generatePassword();
        newUser.setPassword(encodePassword(password));

        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPhone(user.getPhone());
        newUser.setAddress(user.getAddress());
        newUser.setRole(user.getRole());
        newUser.setStatus(user.getStatus());

        // save new user into database
        userRepository.save(newUser);
        LOGGER.info("New user password: " + password);


        // send email to inform to new user
        LOGGER.info("send email to inform to new user");

        // email body
        emailBody.append("Hello " + user.getLastName() + " " + user.getFirstName() + ",\n\n");
        emailBody.append("Your new account has just created." + "\n\n");
        emailBody.append("Use the following information to access the Help Desk system:\n\n");
        emailBody.append("- Email: " + user.getEmail() + "\n");
        emailBody.append("- Password: " + password + "\n\n");
        emailBody.append("The Help Desk Team");

        // receiver email
        recipients.add(user.getEmail());

        // send email to inform to new user
        emailService.sendEmail(EMAIL_SUBJECT_CREATE_NEW_USER, emailBody.toString(), recipients);

        return newUser;
    }

    // update existing user
    @Override
    public User updateUser(User user) throws ResourceNotFoundException {

        LOGGER.info("Update user");

        // get existing user(persistent)
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(NO_USER_FOUND_BY_ID + user.getId()));

        // set new values to existing user
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setPhone(user.getPhone());
        existingUser.setAddress(user.getAddress());
        existingUser.setRole(user.getRole());
        existingUser.setStatus(user.getStatus());

        // update existing user(persistent)
        userRepository.save(existingUser);

        return existingUser;
    }

    // update user profile
    @Override
    public User updateProfile(EditProfile editProfile) throws ResourceNotFoundException {

        LOGGER.info("Update profile");

        // get existing user(persistent)
        User existingUser = userRepository.findById(editProfile.getId())
                .orElseThrow(() -> new ResourceNotFoundException(NO_USER_FOUND_BY_ID + editProfile.getId()));

        // set new values to existing user
        existingUser.setFirstName(editProfile.getFirstName());
        existingUser.setLastName(editProfile.getLastName());
        existingUser.setPhone(editProfile.getPhone());
        existingUser.setAddress(editProfile.getAddress());

        // update existing user(persistent)
        userRepository.save(existingUser);

        return existingUser;
    }

    // return:
    //  - true: email already existed in the database before
    //  - false: email has not existed in the database
    private boolean existEmail(String email) {

        User user = findUserByEmail(email);

        return (user != null);
    }

    // encode password
    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    // generate random password
    private String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(10);
    }

}
