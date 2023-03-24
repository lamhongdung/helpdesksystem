package com.ez.service;

import com.ez.dto.DropdownResponse;
import com.ez.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private TicketRepository ticketRepository;

    // get all ticket status.
    // 5 status + 1 dummy status:
    //  - All(dummy)
    //  - Open
    //  - Cancel
    //  - Assigned
    //  - Resolved
    //  - Closed
    public List<DropdownResponse> getAllTicketStatus() {

        LOGGER.info("Get all ticket status");

        return ticketRepository.getAllTicketStatus();
    }

    // get creators by userid(and by user role).
    public List<DropdownResponse> getCreatorsByUserid(int userid) {

        LOGGER.info("Get creators by user id(and by user role)");

        return ticketRepository.getCreatorsByUserid(userid);
    }

    // get teams by userid(and by user role).
    public List<DropdownResponse> getTeamsByUserid(int userid) {

        LOGGER.info("Get teams by userid(and by user role)");

        return ticketRepository.getTeamsByUserid(userid);
    }

    // get all categories.
    public List<DropdownResponse> getAllCategories() {

        LOGGER.info("Get all categories");

        return ticketRepository.getAllCategories();
    }

    // get all priorities.
    public List<DropdownResponse> getAllPriorities() {

        LOGGER.info("Get all priorities");

        return ticketRepository.getAllPriorities();
    }

}
