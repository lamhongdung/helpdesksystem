package com.ez.service;

import com.ez.entity.Team;
import com.ez.exception.IDNotFoundException;
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

//    // create new category
//    public Category createCategory(Category category){
//
//        LOGGER.info("create new category");
//
//        // new user
//        Category newCategory = new Category(category.getName(), category.getStatus());
//
//        // save new category into database
//        categoryRepository.save(newCategory);
//
//        return newCategory;
//    }
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
