package com.ez.controller;

import com.ez.dto.Supporter;
import com.ez.dto.TeamDTO;
import com.ez.entity.Team;
import com.ez.exception.ResourceNotFoundException;
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
    //  - searchTerm: word to search(ID, name). '' is for search all
    //  - assignmentMethod: ''(all), 'A'(Auto), 'M'(Manual)
    //  - status: ''(all), 'Active', 'Inactive'
    @GetMapping("/team-search")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<Team>> searchTeams(@RequestParam int pageNumber,
                                                  @RequestParam int pageSize,
                                                  @RequestParam(required = false, defaultValue = "") String searchTerm,
                                                  @RequestParam(required = false, defaultValue = "") String assignmentMethod,
                                                  @RequestParam(required = false, defaultValue = "") String status) {

        // get all teams of 1 page
        List<Team> teams = teamService.searchTeams(pageNumber, pageSize, searchTerm, assignmentMethod, status);

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
    public ResponseEntity<List<Supporter>> getActiveSupporters() {

        // get active supporters
        List<Supporter> supporters = teamService.getActiveSupporters();

        return new ResponseEntity<>(supporters, OK);
    }

    //
    // create new a team.
    // parameters:
    //  - TeamDTO: team + supporters
    @PostMapping("/team-create")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Team> createTeam(@RequestBody @Valid TeamDTO teamDto, BindingResult bindingResult)
            throws BindException {

        LOGGER.info("validate data");

        // if teamDto data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.error("TeamDTO data is invalid");

            throw new BindException(bindingResult);
        }

        Team newTeam = teamService.createTeam(teamDto);

        LOGGER.info(newTeam.toString());

        return new ResponseEntity<>(newTeam, OK);
    }

    // find team by id.
    // this method is used for Edit team, View team.
    //
    // return:
    //  - TeamDTO: team + supporters
    @GetMapping("/team-list/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<TeamDTO> findById(@PathVariable Long id) throws ResourceNotFoundException {

        LOGGER.info("find team by id: " + id);

        TeamDTO teamDto = teamService.findById(id);

        return new ResponseEntity<>(teamDto, OK);
    }

    // edit existing team.
    //
    // parameters:
    //  - TeamDTO: team + supporters
    @PutMapping("/team-edit")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Team> editTeam(@RequestBody @Valid TeamDTO teamDto, BindingResult bindingResult)
            throws ResourceNotFoundException, BindException {

        LOGGER.info("validate data");

        // if teamDto data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.error("TeamDTO data is invalid");

            throw new BindException(bindingResult);
        }

        Team currentTeam = teamService.updateTeam(teamDto);

        return new ResponseEntity<>(currentTeam, OK);
    }

}
