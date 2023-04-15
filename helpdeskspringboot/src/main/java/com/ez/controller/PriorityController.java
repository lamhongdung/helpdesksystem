package com.ez.controller;

import com.ez.entity.Priority;
import com.ez.service.PriorityService;
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
public class PriorityController {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    PriorityService priorityService;

    //
    // search priorities by pageNumber and based on the search criteria
    //
    // url: ex: /priority-search?pageNumber=0&pageSize=5&searchTerm=""&resolveInOpt="gt"&resolveIn=0&status=""
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size(default = 5)
    //  - searchTerm: word to search(ID, name). '' is for search all
    //  - resolveInOpt: gt(>=), eq(=), lt(<=)
    //  - resolveIn: number of hours to complete a ticket
    //  - status: ''(all), 'Active', 'Inactive'
    @GetMapping("/priority-search")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<Priority>> searchPriorities(@RequestParam int pageNumber,
                                                           @RequestParam int pageSize,
                                                           @RequestParam(required = false, defaultValue = "") String searchTerm,
                                                           @RequestParam(required = false, defaultValue = "gt") String resolveInOpt,
                                                           @RequestParam(required = false, defaultValue = "0") long resolveIn,
                                                           @RequestParam(required = false, defaultValue = "") String status) {

        // get all priorities of 1 page
        List<Priority> priorities = priorityService.searchPriorities(pageNumber, pageSize, searchTerm, resolveInOpt, resolveIn, status);

        return new ResponseEntity<>(priorities, OK);
    }

    //
    // calculate total of priorities based on the search criteria.
    // use this total of priorities value to calculate total pages for pagination.
    //
    // url: ex: /total-of-priorities?searchTerm=""&resolveInOpt="gt"&resolveIn=0&status=""
    @GetMapping("/total-of-priorities")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfPriorities(@RequestParam(required = false, defaultValue = "") String searchTerm,
                                                     @RequestParam(required = false, defaultValue = "gt") String resolveInOpt,
                                                     @RequestParam(required = false, defaultValue = "0") long resolveIn,
                                                     @RequestParam(required = false, defaultValue = "") String status) {

        // calculate total of priorities based on the search criteria
        long totalOfPriorities = priorityService.getTotalOfPriorities(searchTerm, resolveInOpt, resolveIn, status);

        return new ResponseEntity<>(totalOfPriorities, HttpStatus.OK);
    }

    //
    // create new a priority
    //
    @PostMapping("/priority-create")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Priority> createPriority(@RequestBody @Valid Priority priority, BindingResult bindingResult)
            throws BindException {

        LOGGER.info("validate data");

        // if priority data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("Priority data is invalid");

            throw new BindException(bindingResult);
        }

        Priority newCategory = priorityService.createPriority(priority);

        return new ResponseEntity<>(newCategory, OK);
    }

    // find priority by id.
    // this method is used for Edit priority, View priority
    @GetMapping("/priority-list/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Priority> findById(@PathVariable Long id) throws EntityNotFoundException {

        LOGGER.info("find priority by id: " + id);

        Priority priority = priorityService.findById(id);

        return new ResponseEntity<>(priority, OK);
    }

    // edit existing priority
    @PutMapping("/priority-edit")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Priority> editPriority(@RequestBody @Valid Priority priority, BindingResult bindingResult)
            throws EntityNotFoundException, BindException {

        LOGGER.info("validate data");

        // if priority data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("Priority data is invalid");

            throw new BindException(bindingResult);
        }

        Priority currentPriority = priorityService.updatePriority(priority);

        return new ResponseEntity<>(currentPriority, OK);
    }

}
