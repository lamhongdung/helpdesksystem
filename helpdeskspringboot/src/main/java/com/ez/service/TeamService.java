package com.ez.service;

import com.ez.dto.Supporter;
import com.ez.dto.TeamDTO;
import com.ez.entity.Team;
import com.ez.repository.TeamRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class TeamService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private TeamRepository teamRepository;

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

    // get active supporters
    public List<Supporter> getActiveSupporters() {

        LOGGER.info("get active supporters");

        return teamRepository.getActiveSupporters();
    }

    // create new team
    public Team createTeam(TeamDTO teamDto) {

        LOGGER.info("create new team");
        LOGGER.info("team is sent from client: " + teamDto.toString());

        // new team
        Team newTeam = new Team(teamDto.getName(), teamDto.getAssignmentMethod(), teamDto.getStatus());

        // save new team into the "team" table in database.
        // after save successful then the newTeam will have its id
        teamRepository.save(newTeam);
        LOGGER.info("new team after saved: " + newTeam.toString());

        // save (teamid and supporterid) in the "teamSupporter" table in database
        teamDto.getSupporters().forEach(s -> teamRepository.saveTeamSupporter(newTeam.getId(), s.getId()));

        return newTeam;
    }
//
//    // find category by category id
//    public Category findById(Long id) throws IDNotFoundException {
//
//        LOGGER.info("find category by id");
//
//        // find category by category id
//        return categoryRepository.findById(id).orElseThrow(() -> new IDNotFoundException(NO_CATEGORY_FOUND_BY_ID + id));
//    }
//
//    // update existing category
//    public Category updateCategory(Category category) throws IDNotFoundException {
//
//        LOGGER.info("Update category");
//
//        // get existing category(persistent)
//        Category existingCategory = categoryRepository.findById(category.getId())
//                .orElseThrow(() -> new IDNotFoundException(NO_CATEGORY_FOUND_BY_ID + category.getId()));
//
//        // set new values to existing category
//        existingCategory.setName(category.getName());
//        existingCategory.setStatus(category.getStatus());
//
//        // update existing category(persistent)
//        categoryRepository.save(existingCategory);
//
//        return existingCategory;
//    }

}
