package com.ez.controller;

import com.ez.payload.DropdownResponse;
import com.ez.payload.TeamRequest;
import com.ez.payload.TeamResponse;
import com.ez.entity.Team;
import com.ez.service.TeamService;
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

import static org.springframework.http.HttpStatus.OK;

@RestController
public class TeamController {
    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    TeamService teamService;

    //
    // search teams by pageNumber and based on the search criteria
    //
    // url: ex: /team-search?pageNumber=0&pageSize=5&searchTerm=""&assignmentMethod=""&status=""
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size(default = 5)
    //  - searchTerm: word to search(ID, team name). '' is for search all
    //  - assignmentMethod: ''(all), 'A'(Auto), 'M'(Manual)
    //  - status: ''(all), 'Active', 'Inactive'
    @GetMapping("/team-search")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<TeamResponse>> searchTeams(@RequestParam int pageNumber,
                                                          @RequestParam int pageSize,
                                                          @RequestParam(required = false, defaultValue = "") String searchTerm,
                                                          @RequestParam(required = false, defaultValue = "") String assignmentMethod,
                                                          @RequestParam(required = false, defaultValue = "") String status) {

        // get all teams of page "pageNumber"
        List<TeamResponse> teams = teamService.searchTeams(pageNumber, pageSize, searchTerm, assignmentMethod, status);

        return new ResponseEntity<>(teams, OK);
    }

    //
    // calculate total of teams based on the search criteria.
    // use this total of teams value to calculate total pages for pagination.
    //
    // url: ex: /total-of-teams?searchTerm=""&assignmentMethod=""&status=""
    @GetMapping("/total-of-teams")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfTeams(@RequestParam(required = false, defaultValue = "") String searchTerm,
                                                @RequestParam(required = false, defaultValue = "") String assignmentMethod,
                                                @RequestParam(required = false, defaultValue = "") String status) {

        // calculate total of teams based on the search criteria
        long totalOfTeams = teamService.getTotalOfTeams(searchTerm, assignmentMethod, status);

        return new ResponseEntity<>(totalOfTeams, HttpStatus.OK);
    }

    //
    // get active supporters
    //
    @GetMapping("/active-supporters")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<DropdownResponse>> getActiveSupporters() {

        // get active supporters
        List<DropdownResponse> supporterResponses = teamService.getActiveSupporters();

        return new ResponseEntity<>(supporterResponses, OK);
    }

    //
    // create a new team.
    // parameters:
    //  - TeamRequest: team + supporters
    @PostMapping("/team-create")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Team> createTeam(@RequestBody @Valid TeamRequest teamRequest, BindingResult bindingResult)
            throws BindException {

        LOGGER.info("validate data");

        // if teamRequest data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("TeamRequest data is invalid");

            throw new BindException(bindingResult);
        }

        // save teamRequest(includes supporters)
        // and return team(not includes supporters)
        Team newTeam = teamService.createTeam(teamRequest);

        LOGGER.info(newTeam.toString());

        return new ResponseEntity<>(newTeam, OK);
    }

    // find team by id.
    // this method is used for "Edit team" and "View team".
    //
    // return:
    //  - TeamRequest: team + supporters
    @GetMapping("/team-list/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<TeamRequest> findById(@PathVariable Long id) throws EntityNotFoundException {

        LOGGER.info("find team by id: " + id);

        TeamRequest teamRequest = teamService.findById(id);

        return new ResponseEntity<>(teamRequest, OK);
    }

    // edit existing team.
    //
    // parameters:
    //  - TeamRequest: team + supporters
    @PutMapping("/team-edit")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Team> editTeam(@RequestBody @Valid TeamRequest teamRequest, BindingResult bindingResult)
            throws EntityNotFoundException, BindException {

        LOGGER.info("validate data");

        // if teamRequest data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("TeamRequest data is invalid");

            throw new BindException(bindingResult);
        }

        // save teamRequest(includes supporters)
        // and return team(not includes supporters)
        Team currentTeam = teamService.updateTeam(teamRequest);

        return new ResponseEntity<>(currentTeam, OK);
    }

}
