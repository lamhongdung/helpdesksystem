//package com.ez.service;
//
//import com.ez.entity.HDCalendar;
//import com.ez.repository.CalendarRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import javax.persistence.EntityNotFoundException;
//import java.util.List;
//
//import static com.ez.constant.Constant.*;

//@Service
//public class CalendarService {
//
//    private Logger LOGGER = LoggerFactory.getLogger(getClass());
//
//    @Autowired
//    private CalendarRepository calendarRepository;
//
//    // get all calendars.
//    // parameters:
//    //  - status = "": all(active + inactive) calendars
//    //  - status = "Active": all active calendars
//    //  - status = "Inactive": all inactive calendars
//    public List<HDCalendar> getAllCalendars(String status) {
//
//        LOGGER.info("get all calendars");
//
//        return calendarRepository.getAllCalendars(status);
//    }
//
//    // search calendars by pageNumber and based on the search criteria.
//    // parameters:
//    //  - pageNumber: page number
//    //  - pageSize: page size
//    //  - searchTerm: ID, name
//    //  - status: ''(All), 'Active', 'Inactive'
//    public List<HDCalendar> searchCalendars(int pageNumber, int pageSize, String searchTerm, String status) {
//
//        LOGGER.info("search calendars");
//
//        return calendarRepository.searchCalendars(pageNumber, pageSize, searchTerm, status);
//    }
//
//    // calculate total of calendars based on the search criteria
//    public long getTotalOfCalendars(String searchTerm, String status) {
//
//        LOGGER.info("get total of calendars");
//
//        return calendarRepository.getTotalOfCalendars(searchTerm, status);
//    }
//
//    // create a new calendar
//    public HDCalendar createCalendar(HDCalendar calendar) {
//
//        LOGGER.info("create new calendar");
//
//        // new calendar
//        HDCalendar newCalendar = new HDCalendar(calendar.getName(), calendar.getStatus());
//
//        // save new calendar into database
//        calendarRepository.save(newCalendar);
//
//        return newCalendar;
//    }
//
//    // find calendar by calendar id
//    public HDCalendar findById(Long id) throws EntityNotFoundException {
//
//        LOGGER.info("find calendar by id");
//
//        // find calendar by calendar id
//        return calendarRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(NO_CALENDAR_FOUND_BY_ID + id));
//    }
//
//    // update existing calendar
//    public HDCalendar updateCalendar(HDCalendar calendar) throws EntityNotFoundException {
//
//        LOGGER.info("Update calendar");
//
//        // get existing calendar(persistent)
//        HDCalendar existingCalendar = calendarRepository.findById(calendar.getId())
//                .orElseThrow(() -> new EntityNotFoundException(NO_CALENDAR_FOUND_BY_ID + calendar.getId()));
//
//        // set new values to existing calendar
//        existingCalendar.setName(calendar.getName());
//        existingCalendar.setStatus(calendar.getStatus());
//
//        // update existing calendar(persistent)
//        calendarRepository.save(existingCalendar);
//
//        return existingCalendar;
//    }
//
//}
