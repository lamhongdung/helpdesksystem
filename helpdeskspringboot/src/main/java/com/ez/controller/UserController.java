package com.ez.controller;

import com.ez.payload.*;
import com.ez.entity.*;
import com.ez.exception.*;
import com.ez.service.UserService;
import com.ez.utility.JWTTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;

import static com.ez.constant.Constant.JWT_TOKEN_HEADER;
import static com.ez.constant.Constant.*;
import static org.springframework.http.HttpStatus.OK;


@RestController
//@RequestMapping(path = {"/", "/user"})
public class UserController extends ExceptionHandling {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JWTTokenProvider jwtTokenProvider;

    // login to the Help Desk system
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody @Valid LoginUser loginUser, BindingResult bindingResult) throws BindException, BadDataException {

        LOGGER.info("validate data");

        // if loginUser data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("LoginUser data is invalid");

            throw new BindException(bindingResult);
        }

        // if user is inactive then show error to user
        if (userService.isInactiveUser(loginUser.getEmail()) != null) {

            LOGGER.info("User is inactive");

            throw new BadDataException(USER_IS_INACTIVE);
        }

        // if username or password is invalid then throw an exception
        authenticate(loginUser.getEmail(), loginUser.getPassword());

        // authenticate success(username and password are correct)
        User user = userService.findUserByEmail(loginUser.getEmail());

        // get the generated JWT and send back to client
        UserPrincipal userPrincipal = new UserPrincipal(user);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);

        // return user(body), jwt token(header) and status
        return new ResponseEntity<>(user, jwtHeader, OK);
    }

    // search users by pageNumber based on the search criteria
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size(default = 5)
    //  - searchTerm: word to search(ID, email, firstName, lastName, phone). '' is for search all
    //  - role: ''(all), ROLE_CUSTOMER, ROLE_SUPPORTER, ROLE_ADMIN
    //  - status: ''(all), 'Active', 'Inactive'
    @GetMapping("/user-search")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<User>> searchUsers(@RequestParam int pageNumber,
                                                  @RequestParam int pageSize,
                                                  @RequestParam(defaultValue = "") String searchTerm,
                                                  @RequestParam(defaultValue = "") String role,
                                                  @RequestParam(defaultValue = "") String status) {

        // get all users of 1 page
        List<User> users = userService.searchUsers(pageNumber, pageSize, searchTerm, role, status);

        return new ResponseEntity<>(users, OK);
    }

    // calculate total of users based on the search criteria.
    // use this total of users value to calculate total pages for pagination.
    @GetMapping("/total-of-users")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfUsers(@RequestParam(defaultValue = "") String searchTerm,
                                                @RequestParam(defaultValue = "") String role,
                                                @RequestParam(defaultValue = "") String status) {

        // calculate total of users based on the search criteria
        long totalOfUsers = userService.getTotalOfUsers(searchTerm, role, status);

        return new ResponseEntity<>(totalOfUsers, HttpStatus.OK);
    }

    // create new user
    @PostMapping("/user-create")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody @Valid User user, BindingResult bindingResult)
            throws BadDataException, MessagingException, BindException {

        LOGGER.info("validate data");

        // if user data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("User data is invalid");

            throw new BindException(bindingResult);
        }

        User newUser = userService.createUser(user);

        return new ResponseEntity<>(newUser, OK);
    }

    // find user by id.
    // this method is used for Edit User, Edit Profile
    @GetMapping("/user-list/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<User> findById(@PathVariable Long id) throws EntityNotFoundException {

        LOGGER.info("find user by id: " + id);

        User user = userService.findById(id);

        return new ResponseEntity<>(user, OK);
    }

    // edit existing user
    @PutMapping("/user-edit")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<User> editUser(@RequestBody @Valid User user, BindingResult bindingResult)
            throws BadDataException, MessagingException, EntityNotFoundException, BindException {

        LOGGER.info("validate data");

        // if user data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("User data is invalid");

            throw new BindException(bindingResult);
        }

        User currentUser = userService.updateUser(user);

        return new ResponseEntity<>(currentUser, OK);
    }

    // update profile
    @PutMapping("/edit-profile")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<User> updateProfile(@RequestBody @Valid EditProfile editProfile, BindingResult bindingResult)
            throws MessagingException, EntityNotFoundException, BindException {

        LOGGER.info("validate data");

        // if user data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("User data is invalid");

            throw new BindException(bindingResult);
        }

        User currentUser = userService.updateProfile(editProfile);

        return new ResponseEntity<>(currentUser, OK);
    }

    // reset password in case user forgot his/her password
    @PutMapping("/reset-password")
    public ResponseEntity<HttpResponse> resetPassword(@RequestBody @Valid ResetPassword resetPassword, BindingResult bindingResult)
            throws MessagingException, EntityNotFoundException, BindException {

        LOGGER.info("validate data");

        // if email is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("ResetPassword data is invalid");

            throw new BindException(bindingResult);
        }

        // reset password
        userService.resetPassword(resetPassword.getEmail());

        return response(OK, RESET_PASSWORD + resetPassword.getEmail());
    }

    // change user password
    @PutMapping("/change-password")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<HttpResponse> changePassword(@RequestBody @Valid ChangePassword changePassword, BindingResult bindingResult)
            throws MessagingException, EntityNotFoundException, BadDataException, BadDataException, BindException {

        LOGGER.info("validate data");

        // if changePassword object(email, oldPassword, newPassword and confirmNewPassword) is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("ChangePassword data is invalid");

            throw new BindException(bindingResult);
        }

        // change password
        userService.changePassword(changePassword);

        return response(OK, "Changed password for email " + changePassword.getEmail() + " successful.");

    }

    //
    // get supporters + 1 dummy
    //
    // parameters:
    //  - status:
    //      =0: all supporters(active + inactive) + 1 dummy
    //      =1: active supporters + 1 dummy
    //      =2: inactive supporters + 1 dummy
    //
    // return:
    //  - id
    //  - description = id + fullname + status
    //
    // all authenticated users can access this resource.
    @GetMapping("/user-supporter-status")
    public ResponseEntity<List<DropdownResponse>> getSupporters(@RequestParam long status) {

        // get supporters + 1 dummy
        List<DropdownResponse> supporters = userService.getSupporters(status);

        return new ResponseEntity<>(supporters, OK);
    }

    // create new instance HttpResponse
    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {

        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), message), httpStatus);
    }

    // get header with JWT token.
    // use this header to send back client
    private HttpHeaders getJwtHeader(UserPrincipal user) {

        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(user));

        return headers;
    }

    // authenticate email and password sent from client is valid or not
    private void authenticate(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }
}

