package com.ez.service;

import com.ez.entity.Ticket;
import com.ez.exception.BadDataException;
import com.ez.payload.*;
import com.ez.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindException;

import javax.persistence.EntityNotFoundException;
import java.util.List;

import static com.ez.constant.Constant.*;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

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

    // get next appropriate ticket status
    // for loading ticket status in the "Ticket status" dropdown control in the "Edit ticket" screen
    public List<DropdownResponse> getNextTicketStatus(long ticketid) {

        LOGGER.info("get next appropriate ticket status");

        return ticketRepository.getNextTicketStatus(ticketid);
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

    // get all active teams
    public List<DropdownResponse> getAllActiveTeams() {

        LOGGER.info("Get all active teams)");

        return ticketRepository.getAllActiveTeams();
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

    // get all active categories
    public List<DropdownResponse> getAllActiveCategories() {

        LOGGER.info("Get all active categories)");

        return ticketRepository.getAllActiveCategories();
    }

    // get priorities by userid(and by user role).
    public List<DropdownResponse> getPrioritiesByUserid(int userid) {

        LOGGER.info("Get priorities by user id(and by user role)");

        return ticketRepository.getPrioritiesByUserid(userid);
    }

    // get all active priorities
    public List<DropdownResponse> getAllActivePriorities() {

        LOGGER.info("Get all active priorities");

        return ticketRepository.getAllActivePriorities();
    }

    // get active supporters belong team
    public List<DropdownResponse> getActiveSupportersBelongTeam(long ticketid) {

        LOGGER.info("get active supporters belong team");

        return ticketRepository.getActiveSupportersBelongTeam(ticketid);
    }

    // search tickets by userid(and by user role).
    public List<TicketSearchResponse> searchTickets(long userid, long pageNumber, long pageSize,
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

    // create a new ticket.
    public HttpResponse createTicket(TicketCreateRequest ticketCreateRequest) {

        LOGGER.info("create a new ticket");
        LOGGER.info("Ticket is sent from client: " + ticketCreateRequest.toString());

        // save new ticket into the "ticket" table in database.
        ticketRepository.saveTicket(
                ticketCreateRequest.getCreatorid(),
                ticketCreateRequest.getSubject(),
                ticketCreateRequest.getContent(),
                ticketCreateRequest.getTeamid(),
                ticketCreateRequest.getCategoryid(),
                ticketCreateRequest.getPriorityid(),
                ticketCreateRequest.getCustomFilename()
        );

        return new HttpResponse(OK.value(), "Ticket is created successful!");
    }

    // get ticket by ticket id.
    public TicketEditViewResponse getTicketById(Long id) {

        return ticketRepository.getTicketById(id);
    }

    // update existing ticket.
    public HttpResponse updateTicket(TicketEditRequest ticketEditRequest) throws EntityNotFoundException, BadDataException {

        LOGGER.info("Update ticket");
        LOGGER.info("Ticket is sent from client: " + ticketEditRequest.toString());

        // get existing team(persistent)
        Ticket existingTicket = ticketRepository.findById(ticketEditRequest.getTicketid())
                .orElseThrow(() -> new EntityNotFoundException(NO_TICKET_FOUND_BY_ID + ticketEditRequest.getTicketid()));

        if (existingTicket.getTicketStatusid() == TICKET_STATUS_CLOSED){
            throw new BadDataException("Ticket status is 'Closed', so you cannot modify this ticket.");
        }

        if (existingTicket.getTicketStatusid() == TICKET_STATUS_CANCEL){
            throw new BadDataException("Ticket status is 'Cancel', so you cannot modify this ticket.");
        }

        // set new values to existing ticket
//        existingTicket.setLastUpdateByUserid(ticketEditRequest.getLastUpdateByUserid());
//        existingTicket.setCategoryid(ticketEditRequest.getCategoryid());
//        existingTicket.setPriorityid(ticketEditRequest.getPriorityid());
//        existingTicket.setAssigneeid(ticketEditRequest.getAssigneeid());
//        existingTicket.setTicketStatusid(ticketEditRequest.getTicketStatusid());

        // update existing team without supporters
//        ticketRepository.save(existingTicket);
        ticketRepository.updateTicket(
                ticketEditRequest.getTicketid(),
                ticketEditRequest.getLastUpdateByUserid(),
                ticketEditRequest.getCategoryid(),
                ticketEditRequest.getPriorityid(),
                ticketEditRequest.getAssigneeid(),
                ticketEditRequest.getTicketStatusid());

        return new HttpResponse(OK.value(),
                "Ticket " + ticketEditRequest.getTicketid() + " is updated successful.");

    }

//    private ResponseEntity<HttpResponse> createHttpResponse(HttpStatus httpStatus, String message) {
//
//        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), message), httpStatus);
//
//    }

}
