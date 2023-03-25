package com.ez.controller;

import com.ez.dto.DropdownResponse;
import com.ez.dto.TicketResponse;
import com.ez.service.TicketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAllTicketStatus() {

        // get all ticket status
        List<DropdownResponse> allTicketStatus = ticketService.getAllTicketStatus();

        return new ResponseEntity<>(allTicketStatus, OK);
    }

    // get creators by userid(and by user role).
    @GetMapping("/creators")
    // all users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getCreatorsByUserid(@RequestParam int userid) {

        // get creators by userid(and by user role)
        List<DropdownResponse> creatorsResponses = ticketService.getCreatorsByUserid(userid);

        return new ResponseEntity<>(creatorsResponses, OK);
    }

    // get teams by userid(and by user role).
    @GetMapping("/teams")
    // all users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getTeamsByUserid(@RequestParam int userid) {

        // get teams by userid(and by user role)
        List<DropdownResponse> teamsResponses = ticketService.getTeamsByUserid(userid);

        return new ResponseEntity<>(teamsResponses, OK);
    }

    // get assignees by userid(and by user role).
    @GetMapping("/assignees")
    // all users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAssigneesByUserid(@RequestParam int userid) {

        // get assignees by userid(and by user role)
        List<DropdownResponse> assigneesResponses = ticketService.getAssigneesByUserid(userid);

        return new ResponseEntity<>(assigneesResponses, OK);
    }

    // get categories by userid(and by user role).
    @GetMapping("/categories")
    // all users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getCategoriesByUserid(@RequestParam int userid) {

        // get all categories
        List<DropdownResponse> categoryResponses = ticketService.getCategoriesByUserid(userid);

        return new ResponseEntity<>(categoryResponses, OK);
    }

    // get priorities by userid(and by user role).
    @GetMapping("/priorities")
    // all users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getPrioritiesByUserid(@RequestParam int userid) {

        // get all priorities
        List<DropdownResponse> priorityResponses = ticketService.getPrioritiesByUserid(userid);

        return new ResponseEntity<>(priorityResponses, OK);
    }

    // get priorities by userid(and by user role).
    @GetMapping("/ticket-search")
    // all users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<TicketResponse>> getTicketsByUserid(@RequestParam(required = false, defaultValue = "0") long userid,
//                                                                   @RequestParam int pageNumber,
//                                                                   @RequestParam int pageSize,
                                                                   @RequestParam(required = false, defaultValue = "") String searchTerm) {

        // get tickets by userid(and by user role)
        List<TicketResponse> ticketResponses = ticketService.getTicketsByUserid(userid, searchTerm);

        return new ResponseEntity<>(ticketResponses, OK);
    }

    //
    // calculate total of teams based on the search criteria.
    // use this total of teams value to calculate total pages for pagination.
    //
    // url: ex: /total-of-teams?searchTerm=""&assignmentMethod=""&status=""
    @GetMapping("/total-of-tickets")
    // only the ROLE_ADMIN can access this address
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfTickets(@RequestParam(required = false, defaultValue = "") long userid,
                                                  @RequestParam(required = false, defaultValue = "") String searchTerm) {

        // calculate total of teams based on the search criteria
        long totalOfTickets = ticketService.getTotalOfTickets(userid, searchTerm);

        return new ResponseEntity<>(totalOfTickets, HttpStatus.OK);
    }

}
