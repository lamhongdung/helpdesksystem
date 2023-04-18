package com.ez.service;

import com.ez.payload.DropdownResponse;
import com.ez.payload.Supporter;
import com.ez.payload.TeamRequest;
import com.ez.payload.TeamResponse;
import com.ez.entity.Team;
import com.ez.repository.TeamRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;

import static com.ez.constant.Constant.*;


@Service
public class TeamService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private TeamRepository teamRepository;

    // search teams by pageNumber and based on the search criteria.
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size
    //  - searchTerm: ID, team name
    //  - assignmentMethod: ''(all), 'A'(Auto), 'M'(Manual)
    //  - status: ''(all), 'Active', 'Inactive'
    public List<TeamResponse> searchTeams(int pageNumber, int pageSize,
                                          String searchTerm, String assignmentMethod, String status) {

        LOGGER.info("search teams");

        return teamRepository.searchTeams(pageNumber, pageSize, searchTerm, assignmentMethod, status);
    }

    // calculate total of teams based on the search criteria
    public long getTotalOfTeams(String searchTerm, String assignmentMethod, String status) {

        LOGGER.info("get total of teams");

        return teamRepository.getTotalOfTeams(searchTerm, assignmentMethod, status);
    }

    // get active supporters.
    // note:
    //  - interface DropdownResponse: include 2 columns: id(getId()) and description(getDescription())
    public List<DropdownResponse> getActiveSupporters() {

        LOGGER.info("get active supporters");

        return teamRepository.getActiveSupporters();
    }

    //
    // get teams.
    //
    // parameters:
    // - status:
    //      = 0: all teams(active + inactive) + 1 dummy
    //      = 1: active teams + 1 dummy
    //      = 2: inactive teams + 1 dummy
    // return:
    //  - id
    //  - description = id + name + assignment method
    public List<DropdownResponse> getTeams(long status) {

        LOGGER.info("get teams");

        return teamRepository.getTeams(status);
    }

    // create a new team.
    // save team in both tables: team and teamSupporter
    // note:
    //  - class Team: not include supporters
    //  - class TeamRequest: include supporters
    public Team createTeam(TeamRequest teamRequest) {

        LOGGER.info("create a new team");
        LOGGER.info("Team is sent from client: " + teamRequest.toString());

        // create a new team without supporters
//        Team newTeam = new Team(teamRequest.getName(), teamRequest.getAssignmentMethod(),
//                teamRequest.getCalendarid(), teamRequest.getStatus());
        Team newTeam = new Team(teamRequest.getName(), teamRequest.getAssignmentMethod(), teamRequest.getStatus());

        // save the new team into the "team" table in database.
        // after saving successful then the newTeam will have its id
        teamRepository.save(newTeam);
        LOGGER.info("new team after saved: " + newTeam.toString());

        // save (teamid and supporterid) in the "teamSupporter" table in database.
        // loop through all supporters in the teamRequest
        teamRequest.getSupporters().forEach(supporter -> teamRepository.saveTeamSupporter(newTeam.getId(), supporter.getId()));

        // return team without supporters
        return newTeam;
    }

    // find team by team id.
    // note:
    //  - class Team: not include supporters
    //  - class TeamRequest: include supporters
    //  - interface DropdownResponse: include 2 columns:
    //      id(getId()) and description(getDescription() = "id" + "lastName" + "firstName" + "email" + "status")
    //  - class Supporter: include 2 columns: id and description
    public TeamRequest findById(Long id) throws EntityNotFoundException {

        // team without supporters
        Team team;

        // team includes supporters
        TeamRequest teamRequest = new TeamRequest();

        //  interface Supporter: include 2 columns: id(getId()) and description(getDescription()).
        //  selected(assigned) supporters
        List<DropdownResponse> selectedSupporters;

        // class Supporter: include 2 columns: id and description
        List<Supporter> supporters = new ArrayList<>();

        // return team without supporters
        team = teamRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(NO_TEAM_FOUND_BY_ID + id));
        LOGGER.info("found team with id " + team.getId());
        LOGGER.info("team is in string format: " + team.toString());

        //
        // convert from list of selectedSupporters(interface) to list of supporters(class).
        // (convert from functions to columns).
        //

        // get selected supporters.
        // selectedSupporters = list of {id, description}
        selectedSupporters = teamRepository.getSelectedSupporters(id);

        // convert list of selectedSupporters(interface SupporterResponse) to list of supporters(class).
        // selectedSupporters(interface): list of {id(getId()), description(getDescription())}.
        // supporters(class): list of {id, description}.
        // decription = id + lastName + firstName + email + status
        selectedSupporters.forEach(selectedSupporter ->
                supporters.add(new Supporter(selectedSupporter.getId(), selectedSupporter.getDescription())));

        //
        // convert "team(without supporters) + supporters" to teamRequest(includes supporters)
        //
        teamRequest.setId(team.getId());
        teamRequest.setName(team.getName());
        teamRequest.setAssignmentMethod(team.getAssignmentMethod());
//        teamRequest.setCalendarid(team.getCalendarid());
        teamRequest.setStatus(team.getStatus());

        // add supporters to the "teamRequest".
        // note: supporters = list of {id, description}
        teamRequest.setSupporters(supporters);

        // return teamRequest(include supporters)
        return teamRequest;
    }

    // update existing team.
    // save team in both tables:
    //  - table team: contains columns (id, name, assignmentMethod, status)
    //  - table teamSupporter: contains 2 columns (teamid, supporterid)
    // note:
    //  - class Team: not include supporters
    //  - class TeamRequest: include supporters
    public Team updateTeam(TeamRequest teamRequest) throws EntityNotFoundException {

        LOGGER.info("Update team");
        LOGGER.info("Team is sent from client: " + teamRequest.toString());

        // get existing team(persistent)
        Team existingTeam = teamRepository.findById(teamRequest.getId())
                .orElseThrow(() -> new EntityNotFoundException(NO_TEAM_FOUND_BY_ID + teamRequest.getId()));

        // set new values to existing team
        existingTeam.setName(teamRequest.getName());
        existingTeam.setAssignmentMethod(teamRequest.getAssignmentMethod());
//        existingTeam.setCalendarid(teamRequest.getCalendarid());
        existingTeam.setStatus(teamRequest.getStatus());

        // update existing team without supporters
        teamRepository.save(existingTeam);

        //
        // update (teamid and supporterid) in the "teamSupporter" table in database.
        //

        // delete old data by teamid in the "teamSupporter" table
        teamRepository.deleteTeamSupporter(teamRequest.getId());

        //
        // save relation between team and supporters into the "teamSupporter" table.
        //

        // loop through all supporters in the teamRequest.
        teamRequest.getSupporters().forEach(supporter -> teamRepository.saveTeamSupporter(teamRequest.getId(), supporter.getId()));

        return existingTeam;
    }

}
