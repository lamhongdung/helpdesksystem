package com.ez.controller;

import com.ez.dto.DropdownResponse;
import com.ez.service.TicketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class TicketController {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    TicketService ticketService;

    // get all ticket status.
    // 5 status + 1 dummy status:
    //  - All(dummy)
    //  - Open
    //  - Cancel
    //  - Assigned
    //  - Resolved
    //  - Closed
    @GetMapping("/ticketStatus")
    // all users can access this resource
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAllTicketStatus() {

        // get all ticket status
        List<DropdownResponse> allTicketStatus = ticketService.getAllTicketStatus();

        return new ResponseEntity<>(allTicketStatus, OK);
    }

    // get creators by userid(and by user role).
    @GetMapping("/creators")
    // all users can access this resource
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getCreatorsByUserid(@RequestParam int userid) {

        // get creators by userid(and by user role)
        List<DropdownResponse> creatorsResponses = ticketService.getCreatorsByUserid(userid);

        return new ResponseEntity<>(creatorsResponses, OK);
    }

    // get teams by userid(and by user role).
    @GetMapping("/teams")
    // all users can access this resource
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAllTeamsByUserid(@RequestParam int userid) {

        // get teams by userid(and by user role)
        List<DropdownResponse> teamsResponses = ticketService.getTeamsByUserid(userid);

        return new ResponseEntity<>(teamsResponses, OK);
    }

    // get all categories.
    @GetMapping("/categories")
    // all users can access this resource
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAllCategories() {

        // get all categories
        List<DropdownResponse> categoryResponses = ticketService.getAllCategories();

        return new ResponseEntity<>(categoryResponses, OK);
    }

    // get all priorities.
    @GetMapping("/priorities")
    // all users can access this resource
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAllPriorities() {

        // get all priorities
        List<DropdownResponse> priorityResponses = ticketService.getAllPriorities();

        return new ResponseEntity<>(priorityResponses, OK);
    }

}
