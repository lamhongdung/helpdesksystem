package com.ez.service;

import com.ez.entity.Priority;
import com.ez.exception.ResourceNotFoundException;
import com.ez.repository.PriorityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ez.constant.Constant.*;

@Service
public class PriorityService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private PriorityRepository priorityRepository;

    // search priorities by pageNumber and based on the search criteria.
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size
    //  - searchTerm: ID, name
    //  - resolveInOpt: >=(gt), =(eq), <=(lt)
    //  - resolveIn: number of hours to complete a ticket
    //  - status: '', 'Active', 'Inactive'
    public List<Priority> searchPriorities(int pageNumber, int pageSize,
                                           String searchTerm, String resolveInOpt, long resolveIn, String status) {

        LOGGER.info("search priorities");

        return priorityRepository.searchPriorities(pageNumber, pageSize, searchTerm, resolveInOpt, resolveIn, status);
    }

    // calculate total of priorities based on the search criteria
    public long getTotalOfPriorities(String searchTerm, String resolveInOpt, long resolveIn, String status) {
        LOGGER.info("get total of priorities");

        return priorityRepository.getTotalOfPriorities(searchTerm, resolveInOpt, resolveIn, status);
    }

    // create new priority
    public Priority createPriority(Priority priority) {

        LOGGER.info("create new priority");

        // new priority
        Priority newPriority = new Priority(priority.getName(), priority.getResolveIn(), priority.getStatus());

        // save new priority into database
        priorityRepository.save(newPriority);

        return newPriority;
    }

    // find priority by priority id.
    // if has not found the id in database then throws an exception and display notification to user
    public Priority findById(Long id) throws ResourceNotFoundException {

        LOGGER.info("find priority by id");

        // find priority by priority id
        return priorityRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(NO_PRIORITY_FOUND_BY_ID + id));
    }

    // update existing priority.
    // if has not found the id in database then throws an exception and display notification to user
    public Priority updatePriority(Priority priority) throws ResourceNotFoundException {

        LOGGER.info("Update priority");

        // get existing priority(persistent)
        Priority existingPriority = priorityRepository.findById(priority.getId())
                .orElseThrow(() -> new ResourceNotFoundException(NO_PRIORITY_FOUND_BY_ID + priority.getId()));

        // set new values to existing priority
        existingPriority.setName(priority.getName());
        existingPriority.setResolveIn(priority.getResolveIn());
        existingPriority.setStatus(priority.getStatus());

        // update existing priority(persistent) into database
        priorityRepository.save(existingPriority);

        return existingPriority;
    }

}
