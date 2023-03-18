package com.ez.controller;

import com.ez.entity.HDCalendar;
import com.ez.service.CalendarService;
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
public class CalendarController {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    CalendarService calendarService;

    //
    // get all calendars
    //
    @GetMapping("/calendars")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<HDCalendar>> getAllCalendars(@RequestParam(required = false, defaultValue = "") String status) {

        // get all calendars
        List<HDCalendar> calendars = calendarService.getAllCalendars(status);

        return new ResponseEntity<>(calendars, OK);
    }

    //
    // search calendars by pageNumber based on the search criteria
    //
    // url: ex: /calendar-search?pageNumber=0&pageSize=5&searchTerm=""&status=""
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size(default = 5)
    //  - searchTerm: word to search(ID, name). '' is for search all
    //  - status: ''(all), 'Active', 'Inactive'
    @GetMapping("/calendar-search")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<HDCalendar>> searchCalendars(@RequestParam int pageNumber,
                                                            @RequestParam int pageSize,
                                                            @RequestParam(defaultValue = "") String searchTerm,
                                                            @RequestParam(defaultValue = "") String status) {

        // get all calendars of 1 page
        List<HDCalendar> calendars = calendarService.searchCalendars(pageNumber, pageSize, searchTerm, status);

        return new ResponseEntity<>(calendars, OK);
    }

    //
    // calculate total of calendars based on the search criteria.
    // use this total of calendars value to calculate total pages for pagination.
    //
    // url: ex: /total-of-calendars?searchTerm=""&status=""
    @GetMapping("/total-of-calendars")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfCalendars(@RequestParam(defaultValue = "") String searchTerm,
                                                    @RequestParam(defaultValue = "") String status) {

        // calculate total of calendars based on the search criteria
        long totalOfCalendars = calendarService.getTotalOfCalendars(searchTerm, status);

        return new ResponseEntity<>(totalOfCalendars, HttpStatus.OK);
    }

    @PostMapping("/calendar-create")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<HDCalendar> createCalendar(@RequestBody @Valid HDCalendar calendar, BindingResult bindingResult)
            throws BindException {

        LOGGER.info("validate data");

        // if calendar data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.error("Calendar data is invalid");

            throw new BindException(bindingResult);
        }

        HDCalendar newCalendar = calendarService.createCalendar(calendar);

        return new ResponseEntity<>(newCalendar, OK);
    }

    // find calendar by id.
    // this method is used for Edit Calendar
    @GetMapping("/calendar-list/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<HDCalendar> findById(@PathVariable Long id) throws EntityNotFoundException {

        LOGGER.info("find calendar by id: " + id);

        HDCalendar calendar = calendarService.findById(id);

        return new ResponseEntity<>(calendar, OK);
    }

    // edit existing calendar
    @PutMapping("/calendar-edit")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<HDCalendar> editCalendar(@RequestBody @Valid HDCalendar calendar, BindingResult bindingResult)
            throws EntityNotFoundException, BindException {

        LOGGER.info("validate data");

        // if calendar data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.error("Calendar data is invalid");

            throw new BindException(bindingResult);
        }

        HDCalendar currentCalendar = calendarService.updateCalendar(calendar);

        return new ResponseEntity<>(currentCalendar, OK);
    }
}
