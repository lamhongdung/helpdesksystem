package com.ez.service;

import com.ez.dto.DropdownResponse;
import com.ez.dto.TicketResponse;
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
    //  - 0: All(dummy)
    //  - 1: Open
    //  - 2: Assigned
    //  - 3: Resolved
    //  - 4: Closed
    //  - 5: Cancel
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

    // get assignees by userid(and by user role).
    public List<DropdownResponse> getAssigneesByUserid(int userid) {

        LOGGER.info("Get assignees by userid(and by user role)");

        return ticketRepository.getAssigneesByUserid(userid);
    }

    // get categories by userid(and by user role).
    public List<DropdownResponse> getCategoriesByUserid(int userid) {

        LOGGER.info("Get categories by userid(and by user role)");

        return ticketRepository.getCategoriesByUserid(userid);
    }

    // get priorities by userid(and by user role).
    public List<DropdownResponse> getPrioritiesByUserid(int userid) {

        LOGGER.info("Get priorities by user id(and by user role)");

        return ticketRepository.getPrioritiesByUserid(userid);
    }

    // get tickets by userid(and by user role).
    public List<TicketResponse> searchTickets(long userid, long pageNumber, long pageSize,
                                              String searchTerm, String fromDate, String toDate,
                                              String categoryid, String priorityid, String creatorid,
                                              String teamid, String assigneeid, String sla,
                                              String ticketStatusid
    ) {

        LOGGER.info("Get tickets by user id(and by user role)");

        return ticketRepository.searchTicketsByUserid(userid, pageNumber, pageSize,
                searchTerm, fromDate, toDate,
                categoryid, priorityid, creatorid,
                teamid, assigneeid, sla,
                ticketStatusid
        );
    }

    // calculate total of tickets based on the search criteria
    public long getTotalOfTickets(long userid,
                                  String searchTerm, String fromDate, String toDate,
                                  String categoryid, String priorityid, String creatorid,
                                  String teamid, String assigneeid, String sla,
                                  String ticketStatusid) {

        LOGGER.info("get total of tickets");

        return ticketRepository.getTotalOfTickets(userid,
                searchTerm, fromDate, toDate,
                categoryid, priorityid, creatorid,
                teamid, assigneeid, sla,
                ticketStatusid);
    }

}
