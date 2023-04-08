package com.ez.controller;

import com.ez.dto.*;
import com.ez.entity.Team;
import com.ez.entity.Ticket;
import com.ez.exception.OldPasswordIsNotMatchException;
import com.ez.service.TicketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class TicketController {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    TicketService ticketService;

    // get all ticket status
    // for loading ticket status in the "Status" dropdown control in the "Ticket list" screen
    // 5 status + 1 dummy status:
    //  - 0: All(dummy)
    //  - 1: Open
    //  - 2: Assigned
    //  - 3: Resolved
    //  - 4: Closed
    //  - 5: Cancel
    @GetMapping("/ticketStatus")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAllTicketStatus() {

        // get all ticket status
        List<DropdownResponse> allTicketStatus = ticketService.getAllTicketStatus();

        return new ResponseEntity<>(allTicketStatus, OK);
    }

    // get creators by userid(and by user role)
    // for loading creators in the "Creator" dropdown control in the "Ticket list" screen
    @GetMapping("/creators")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getCreatorsByUserid(@RequestParam int userid) {

        // get creators by userid(and by user role)
        List<DropdownResponse> creatorsResponses = ticketService.getCreatorsByUserid(userid);

        return new ResponseEntity<>(creatorsResponses, OK);
    }

    // get team by userid(and by user role)
    // for loading teams in the "Team" dropdown control in the "Ticket list" screen
    @GetMapping("/teams")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getTeamsByUserid(@RequestParam int userid) {

        // get teams by userid(and by user role)
        List<DropdownResponse> teamsResponses = ticketService.getTeamsByUserid(userid);

        return new ResponseEntity<>(teamsResponses, OK);
    }

    // get all active teams
    @GetMapping("/active-teams")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAllActiveTeams() {

        // get all active teams
        List<DropdownResponse> teamsResponses = ticketService.getAllActiveTeams();

        return new ResponseEntity<>(teamsResponses, OK);
    }

    // get assignees by userid(and by user role)
    // for loading assignees in the "Assignee" dropdown control in the "Ticket list" screen
    @GetMapping("/assignees")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAssigneesByUserid(@RequestParam int userid) {

        // get assignees by userid(and by user role)
        List<DropdownResponse> assigneesResponses = ticketService.getAssigneesByUserid(userid);

        return new ResponseEntity<>(assigneesResponses, OK);
    }

    // get categories by userid(and by user role)
    // for loading categories in the "Category" dropdown control in the "Ticket list" screen
    @GetMapping("/categories")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getCategoriesByUserid(@RequestParam int userid) {

        // get all categories
        List<DropdownResponse> categoryResponses = ticketService.getCategoriesByUserid(userid);

        return new ResponseEntity<>(categoryResponses, OK);
    }

    // get all active categories
    @GetMapping("/active-categories")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAllActiveCategories() {

        // get all active categories
        List<DropdownResponse> categoriesResponses = ticketService.getAllActiveCategories();

        return new ResponseEntity<>(categoriesResponses, OK);
    }

    // get priorities by userid(and by user role)
    // for loading priorities in the "Priority" dropdown control in the "Ticket list" screen
    @GetMapping("/priorities")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getPrioritiesByUserid(@RequestParam int userid) {

        // get all priorities
        List<DropdownResponse> priorityResponses = ticketService.getPrioritiesByUserid(userid);

        return new ResponseEntity<>(priorityResponses, OK);
    }

    // get all active priorities
    @GetMapping("/active-priorities")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getAllActivePriorities() {

        // get all active priorities
        List<DropdownResponse> prioritiesResponses = ticketService.getAllActivePriorities();

        return new ResponseEntity<>(prioritiesResponses, OK);
    }

    // search tickets based on the search criteria
    // for loading tickets in table in the "Ticket list" screen
    @GetMapping("/ticket-search")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<TicketResponse>> searchTickets(@RequestParam long userid,
                                                              @RequestParam long pageNumber,
                                                              @RequestParam long pageSize,
                                                              @RequestParam String searchTerm,
                                                              @RequestParam String fromDate,
                                                              @RequestParam String toDate,
                                                              @RequestParam String categoryid,
                                                              @RequestParam String priorityid,
                                                              @RequestParam String creatorid,
                                                              @RequestParam String teamid,
                                                              @RequestParam String assigneeid,
                                                              @RequestParam String sla,
                                                              @RequestParam String ticketStatusid
    ) {

        // get tickets by userid(and by user role) and based on search criteria
        List<TicketResponse> ticketResponses = ticketService.searchTickets(userid, pageNumber, pageSize,
                searchTerm, fromDate, toDate,
                categoryid, priorityid, creatorid,
                teamid, assigneeid, sla,
                ticketStatusid
        );

        return new ResponseEntity<>(ticketResponses, OK);
    }

    //
    // calculate total of tickets based on the search criteria.
    // use this total of tickets value to calculate total pages for pagination.
    //
    // url: ex: /total-of-tickets?userid=20&searchTerm=&fromDate=2023-01-01&toDate=2023-03-28&categoryid=0&priorityid=0&creatorid=0&teamid=0&assigneeid=0&sla=&ticketStatusid=0
    @GetMapping("/total-of-tickets")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfTickets(@RequestParam long userid,
                                                  @RequestParam String searchTerm,
                                                  @RequestParam String fromDate,
                                                  @RequestParam String toDate,
                                                  @RequestParam String categoryid,
                                                  @RequestParam String priorityid,
                                                  @RequestParam String creatorid,
                                                  @RequestParam String teamid,
                                                  @RequestParam String assigneeid,
                                                  @RequestParam String sla,
                                                  @RequestParam String ticketStatusid) {

        // calculate total of tickets based on the search criteria
        long totalOfTickets = ticketService.getTotalOfTickets(userid,
                searchTerm, fromDate, toDate,
                categoryid, priorityid, creatorid,
                teamid, assigneeid, sla,
                ticketStatusid);

        return new ResponseEntity<>(totalOfTickets, HttpStatus.OK);
    }

    //
    // create a new ticket.
    @PostMapping("/ticket-create")
    // all authenticated users can access this resource
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<HttpResponse> createTicket(@RequestBody @Valid TicketRequest ticketRequest, BindingResult bindingResult)
            throws BindException {

        LOGGER.info("validate data");

        // if ticketRequest data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.error("TicketRequest data is invalid");

            throw new BindException(bindingResult);
        }

        // save ticket
        HttpResponse httpResponse = ticketService.createTicket(ticketRequest);

//        LOGGER.info(newTicket.toString());

        return new ResponseEntity<>(httpResponse, OK);
    }

//    // find team by id.
//    // this method is used for "Edit team" and "View team".
//    //
//    // return:
//    //  - TeamRequest: team + supporters
//    @GetMapping("/team-list/{id}")
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
//    public ResponseEntity<TeamRequest> findById(@PathVariable Long id) throws EntityNotFoundException {
//
//        LOGGER.info("find team by id: " + id);
//
//        TeamRequest teamRequest = teamService.findById(id);
//
//        return new ResponseEntity<>(teamRequest, OK);
//    }
//
//    // edit existing team.
//    //
//    // parameters:
//    //  - TeamRequest: team + supporters
//    @PutMapping("/team-edit")
//    // only the ROLE_ADMIN can access this address
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
//    public ResponseEntity<Team> editTeam(@RequestBody @Valid TeamRequest teamRequest, BindingResult bindingResult)
//            throws EntityNotFoundException, BindException {
//
//        LOGGER.info("validate data");
//
//        // if teamRequest data is invalid then throw exception
//        if (bindingResult.hasErrors()) {
//
//            LOGGER.error("TeamRequest data is invalid");
//
//            throw new BindException(bindingResult);
//        }
//
//        // save teamRequest(includes supporters)
//        // and return team(not includes supporters)
//        Team currentTeam = teamService.updateTeam(teamRequest);
//
//        return new ResponseEntity<>(currentTeam, OK);
//    }

}
