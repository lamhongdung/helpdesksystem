package com.ez.service;

import com.ez.dto.Supporter;
import com.ez.dto.SupporterDTO;
import com.ez.dto.TeamDTO;
import com.ez.entity.Team;
import com.ez.entity.User;
import com.ez.exception.ResourceNotFoundException;
import com.ez.repository.TeamRepository;
import com.ez.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.ez.constant.Constant.*;


@Service
public class TeamService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    // search teams by pageNumber and based on the search criteria.
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size
    //  - searchTerm: ID, name
    //  - assignmentMethod: '', 'A'(Auto), 'M'(Manual)
    //  - status: '', 'Active', 'Inactive'
    public List<Team> searchTeams(int pageNumber, int pageSize, String searchTerm, String assignmentMethod, String status) {

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
    //  - interface Supporter: contains 2 fields: id and idFullnameEmail
    public List<Supporter> getActiveSupporters() {

        LOGGER.info("get active supporters");

        return teamRepository.getActiveSupporters();
    }

    // create new team.
    // save team in both tables: team and teamSupporter
    // note:
    //  - class Team: not include supporters
    //  - class TeamDTO: include supporters
    public Team createTeam(TeamDTO teamDto) {

        LOGGER.info("create new team");
        LOGGER.info("Team is sent from client: " + teamDto.toString());

        // new team
        Team newTeam = new Team(teamDto.getName(), teamDto.getAssignmentMethod(), teamDto.getStatus());

        // save new team into the "team" table in database.
        // after saving successful then the newTeam will have its id
        teamRepository.save(newTeam);
        LOGGER.info("new team after saved: " + newTeam.toString());

        // save (teamid and supporterid) in the "teamSupporter" table in database.
        // loop through all supporters in the teamDto
        teamDto.getSupporters().forEach(supporter -> teamRepository.saveTeamSupporter(newTeam.getId(), supporter.getId()));

        // return team without supporters
        return newTeam;
    }

    // find team by team id.
    // note:
    //  - class Team: not include supporters
    //  - class TeamDTO: include supporters
    //  - interface Supporter: include 2 columns: id(getId()) and idFullnameEmail(getIdFullnameEmail())
    //  - class SupporterDTO: include 2 columns: id and idFullnameEmail
    public TeamDTO findById(Long id) throws ResourceNotFoundException {

        // team without supporters
        Team team;

        // team includes supporters
        TeamDTO teamDto = new TeamDTO();

        //  interface Supporter: include 2 columns: id(getId()) and idFullnameEmail(getIdFullnameEmail()).
        //  selected(assigned) supporters
        List<Supporter> selectedSupporters;

        // class SupporterDTO: include 2 columns: id and idFullnameEmail
        List<SupporterDTO> supporterDTOs = new ArrayList<>();

        LOGGER.info("find team by id");

        // return team without supporters
        team = teamRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(NO_TEAM_FOUND_BY_ID + id));

        //
        // convert selectedSupporters to supporterDTOs
        //

        // get selected supporters
        selectedSupporters = teamRepository.getSelectedSupporters(id);

        // convert selectedSupporters to supporterDTOs
        selectedSupporters.forEach(selectedSupporter ->
                supporterDTOs.add(new SupporterDTO(selectedSupporter.getId(), selectedSupporter.getIdFullnameEmail())));

        //
        // convert "team(without supporters) + supporters" to teamDto(includes supporters)
        //
        teamDto.setId(team.getId());
        teamDto.setName(team.getName());
        teamDto.setAssignmentMethod(team.getAssignmentMethod());
        teamDto.setSupporters(supporterDTOs);
        teamDto.setStatus(team.getStatus());

        // return teamDto(include supporters)
        return teamDto;
    }

    // update existing team.
    // save team in both tables: team and teamSupporter
    // note:
    //  - class Team: not include supporters
    //  - class TeamDTO: include supporters
    public Team updateTeam(TeamDTO teamDto) throws ResourceNotFoundException {

        LOGGER.info("Update team");
        LOGGER.info("Team is sent from client: " + teamDto.toString());

        // get existing team(persistent)
        Team existingTeam = teamRepository.findById(teamDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(NO_TEAM_FOUND_BY_ID + teamDto.getId()));

        // set new values to existing team
        existingTeam.setName(teamDto.getName());
        existingTeam.setAssignmentMethod(teamDto.getAssignmentMethod());
        existingTeam.setStatus(teamDto.getStatus());

        // update existing team(persistent)
        teamRepository.save(existingTeam);

        //
        // update (teamid and supporterid) in the "teamSupporter" table in database.
        //

        // delete old data by teamid in the teamSupporter table
        teamRepository.deleteTeamSupporter(teamDto.getId());

        // loop through all supporters in the teamDto
        teamDto.getSupporters().forEach(supporter -> teamRepository.saveTeamSupporter(teamDto.getId(), supporter.getId()));


        return existingTeam;
    }

}
