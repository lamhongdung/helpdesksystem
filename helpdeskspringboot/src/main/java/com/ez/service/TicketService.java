package com.ez.service;

import com.ez.dto.*;
import com.ez.entity.Team;
import com.ez.entity.Ticket;
import com.ez.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;

import static com.ez.constant.Constant.NO_TEAM_FOUND_BY_ID;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@Service
public class TicketService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private TicketRepository ticketRepository;

    // get all ticket status.
    // 5 status + 1 dummy status:
    //  - 0: All(dummy)
    //  - 1: Open
    //  - 2: Assigned
    //  - 3: Resolved
    //  - 4: Closed
    //  - 5: Cancel
    public List<DropdownResponse> getAllTicketStatus() {

        LOGGER.info("Get all ticket status");

        return ticketRepository.getAllTicketStatus();
    }

    // get creators by userid(and by user role).
    public List<DropdownResponse> getCreatorsByUserid(int userid) {

        LOGGER.info("Get creators by user id(and by user role)");

        return ticketRepository.getCreatorsByUserid(userid);
    }

    // get teams by userid(and by user role).
    public List<DropdownResponse> getTeamsByUserid(int userid) {

        LOGGER.info("Get teams by userid(and by user role)");

        return ticketRepository.getTeamsByUserid(userid);
    }

    // get all active teams
    public List<DropdownResponse> getAllActiveTeams() {

        LOGGER.info("Get all active teams)");

        return ticketRepository.getAllActiveTeams();
    }

    // get assignees by userid(and by user role).
    public List<DropdownResponse> getAssigneesByUserid(int userid) {

        LOGGER.info("Get assignees by userid(and by user role)");

        return ticketRepository.getAssigneesByUserid(userid);
    }

    // get categories by userid(and by user role).
    public List<DropdownResponse> getCategoriesByUserid(int userid) {

        LOGGER.info("Get categories by userid(and by user role)");

        return ticketRepository.getCategoriesByUserid(userid);
    }

    // get all active categories
    public List<DropdownResponse> getAllActiveCategories() {

        LOGGER.info("Get all active categories)");

        return ticketRepository.getAllActiveCategories();
    }

    // get priorities by userid(and by user role).
    public List<DropdownResponse> getPrioritiesByUserid(int userid) {

        LOGGER.info("Get priorities by user id(and by user role)");

        return ticketRepository.getPrioritiesByUserid(userid);
    }

    // get all active priorities
    public List<DropdownResponse> getAllActivePriorities() {

        LOGGER.info("Get all active priorities)");

        return ticketRepository.getAllActivePriorities();
    }

    // search tickets by userid(and by user role).
    public List<TicketResponse> searchTickets(long userid, long pageNumber, long pageSize,
                                              String searchTerm, String fromDate, String toDate,
                                              String categoryid, String priorityid, String creatorid,
                                              String teamid, String assigneeid, String sla,
                                              String ticketStatusid
    ) {

        LOGGER.info("Get tickets by user id(and by user role)");

        return ticketRepository.searchTicketsByUserid(userid, pageNumber, pageSize,
                searchTerm, fromDate, toDate,
                categoryid, priorityid, creatorid,
                teamid, assigneeid, sla,
                ticketStatusid
        );
    }

    // calculate total of tickets based on the search criteria
    public long getTotalOfTickets(long userid,
                                  String searchTerm, String fromDate, String toDate,
                                  String categoryid, String priorityid, String creatorid,
                                  String teamid, String assigneeid, String sla,
                                  String ticketStatusid) {

        LOGGER.info("get total of tickets");

        return ticketRepository.getTotalOfTickets(userid,
                searchTerm, fromDate, toDate,
                categoryid, priorityid, creatorid,
                teamid, assigneeid, sla,
                ticketStatusid);
    }

    // create a new ticket.
    public HttpResponse createTicket(TicketRequest ticketRequest) {

        LOGGER.info("create a new ticket");
        LOGGER.info("Ticket is sent from client: " + ticketRequest.toString());

        // save new ticket into the "ticket" table in database.
        ticketRepository.saveTicket(
                ticketRequest.getCreatorid(),
                ticketRequest.getSubject(),
                ticketRequest.getContent(),
                ticketRequest.getTeamid(),
                ticketRequest.getCategoryid(),
                ticketRequest.getPriorityid(),
                ticketRequest.getCustomFilename()
        );

        return new HttpResponse(OK.value(), "Ticket is created successful!");
    }

//    // find team by team id.
//    // note:
//    //  - class Team: not include supporters
//    //  - class TeamRequest: include supporters
//    //  - interface DropdownResponse: include 2 columns:
//    //      id(getId()) and description(getDescription() = "id" + "lastName" + "firstName" + "email" + "status")
//    //  - class Supporter: include 2 columns: id and description
//    public TeamRequest findById(Long id) throws EntityNotFoundException {
//
//        // team without supporters
//        Team team;
//
//        // team includes supporters
//        TeamRequest teamRequest = new TeamRequest();
//
//        //  interface Supporter: include 2 columns: id(getId()) and description(getDescription()).
//        //  selected(assigned) supporters
//        List<DropdownResponse> selectedSupporters;
//
//        // class Supporter: include 2 columns: id and description
//        List<Supporter> supporters = new ArrayList<>();
//
//        // return team without supporters
//        team = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(NO_TEAM_FOUND_BY_ID + id));
//        LOGGER.info("found team with id " + team.getId());
//        LOGGER.info("team is in string format: " + team.toString());
//
//        //
//        // convert from list of selectedSupporters(interface) to list of supporters(class).
//        // (convert from functions to columns).
//        //
//
//        // get selected supporters.
//        // selectedSupporters = list of {id, description}
//        selectedSupporters = teamRepository.getSelectedSupporters(id);
//
//        // convert list of selectedSupporters(interface SupporterResponse) to list of supporters(class).
//        // selectedSupporters(interface): list of {id(getId()), description(getDescription())}.
//        // supporters(class): list of {id, description}.
//        // decription = id + lastName + firstName + email + status
//        selectedSupporters.forEach(selectedSupporter ->
//                supporters.add(new Supporter(selectedSupporter.getId(), selectedSupporter.getDescription())));
//
//        //
//        // convert "team(without supporters) + supporters" to teamRequest(includes supporters)
//        //
//        teamRequest.setId(team.getId());
//        teamRequest.setName(team.getName());
//        teamRequest.setAssignmentMethod(team.getAssignmentMethod());
////        teamRequest.setCalendarid(team.getCalendarid());
//        teamRequest.setStatus(team.getStatus());
//
//        // add supporters to the "teamRequest".
//        // note: supporters = list of {id, description}
//        teamRequest.setSupporters(supporters);
//
//        // return teamRequest(include supporters)
//        return teamRequest;
//    }
//
//    // update existing team.
//    // save team in both tables:
//    //  - table team: contains columns (id, name, assignmentMethod, status)
//    //  - table teamSupporter: contains 2 columns (teamid, supporterid)
//    // note:
//    //  - class Team: not include supporters
//    //  - class TeamRequest: include supporters
//    public Team updateTeam(TeamRequest teamRequest) throws EntityNotFoundException {
//
//        LOGGER.info("Update team");
//        LOGGER.info("Team is sent from client: " + teamRequest.toString());
//
//        // get existing team(persistent)
//        Team existingTeam = teamRepository.findById(teamRequest.getId())
//                .orElseThrow(() -> new EntityNotFoundException(NO_TEAM_FOUND_BY_ID + teamRequest.getId()));
//
//        // set new values to existing team
//        existingTeam.setName(teamRequest.getName());
//        existingTeam.setAssignmentMethod(teamRequest.getAssignmentMethod());
////        existingTeam.setCalendarid(teamRequest.getCalendarid());
//        existingTeam.setStatus(teamRequest.getStatus());
//
//        // update existing team without supporters
//        teamRepository.save(existingTeam);
//
//        //
//        // update (teamid and supporterid) in the "teamSupporter" table in database.
//        //
//
//        // delete old data by teamid in the "teamSupporter" table
//        teamRepository.deleteTeamSupporter(teamRequest.getId());
//
//        //
//        // save relation between team and supporters into the "teamSupporter" table.
//        //
//
//        // loop through all supporters in the teamRequest.
//        teamRequest.getSupporters().forEach(supporter -> teamRepository.saveTeamSupporter(teamRequest.getId(), supporter.getId()));
//
//        return existingTeam;
//    }

    private ResponseEntity<HttpResponse> createHttpResponse(HttpStatus httpStatus, String message) {

        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), message), httpStatus);

    }

}
