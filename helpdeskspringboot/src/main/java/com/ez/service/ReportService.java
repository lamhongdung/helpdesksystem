package com.ez.service;

import com.ez.entity.Ticket;
import com.ez.exception.BadDataException;
import com.ez.payload.*;
import com.ez.repository.ReportRepository;
import com.ez.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

import static com.ez.constant.Constant.*;
import static org.springframework.http.HttpStatus.OK;

@Service
public class ReportService {
    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private ReportRepository reportRepository;

    // search tickets by userid(and by user role).
    public List<WorkloadReportResponse> viewReport(long pageNumber, long pageSize,
                                                   String fromDate, String toDate,
                                                   String teamid,
                                                   String supporterid
    ) {

        LOGGER.info("Get tickets by user id(and by user role)");

        return reportRepository.viewReport(pageNumber, pageSize,
                fromDate, toDate,
                teamid,
                supporterid
        );
    }

//    // calculate total of tickets based on the search criteria
//    public long getTotalOfWorkloads(long userid,
//                                    String searchTerm, String fromDate, String toDate,
//                                    String categoryid, String priorityid, String creatorid,
//                                    String teamid, String assigneeid, String sla,
//                                    String ticketStatusid) {
//
//        LOGGER.info("get total of tickets");
//
//        return ticketRepository.getTotalOfTickets(userid,
//                searchTerm, fromDate, toDate,
//                categoryid, priorityid, creatorid,
//                teamid, assigneeid, sla,
//                ticketStatusid);
//    }
//
//    // create a new ticket.
//    public HttpResponse createTicket(TicketCreateRequest ticketCreateRequest) {
//
//        LOGGER.info("create a new ticket");
//        LOGGER.info("Ticket is sent from client: " + ticketCreateRequest.toString());
//
//        // save new ticket into the "ticket" table in database.
//        ticketRepository.saveTicket(
//                ticketCreateRequest.getCreatorid(),
//                ticketCreateRequest.getSubject(),
//                ticketCreateRequest.getContent(),
//                ticketCreateRequest.getTeamid(),
//                ticketCreateRequest.getCategoryid(),
//                ticketCreateRequest.getPriorityid(),
//                ticketCreateRequest.getCustomFilename()
//        );
//
//        return new HttpResponse(OK.value(), "Ticket is created successful!");
//    }
//
//    // get ticket by ticket id.
//    public TicketEditViewResponse getTicketById(Long id) {
//
//        return ticketRepository.getTicketById(id);
//    }
//
//    // update existing ticket.
//    public HttpResponse updateTicket(TicketEditRequest ticketEditRequest)
//            throws EntityNotFoundException, BadDataException {
//
//        LOGGER.info("Update ticket");
//        LOGGER.info("Ticket is sent from client: " + ticketEditRequest.toString());
//
//        // get existing team(persistent)
//        Ticket existingTicket = ticketRepository.findById(ticketEditRequest.getTicketid())
//                .orElseThrow(() -> new EntityNotFoundException(NO_TICKET_FOUND_BY_ID + ticketEditRequest.getTicketid()));
//
//        // do not allow user modifies the 'Closed' tickets
//        if (existingTicket.getTicketStatusid() == TICKET_STATUS_CLOSED) {
//            throw new BadDataException("Ticket status is 'Closed', so you cannot modify this ticket.");
//        }
//
//        // do not allow user modifies the 'Cancel' tickets
//        if (existingTicket.getTicketStatusid() == TICKET_STATUS_CANCEL) {
//            throw new BadDataException("Ticket status is 'Cancel', so you cannot modify this ticket.");
//        }
//
//        // set new values to existing ticket
////        existingTicket.setLastUpdateByUserid(ticketEditRequest.getLastUpdateByUserid());
////        existingTicket.setCategoryid(ticketEditRequest.getCategoryid());
////        existingTicket.setPriorityid(ticketEditRequest.getPriorityid());
////        existingTicket.setAssigneeid(ticketEditRequest.getAssigneeid());
////        existingTicket.setTicketStatusid(ticketEditRequest.getTicketStatusid());
////        ticketRepository.save(existingTicket);
//
//        // save changes of ticket
//        ticketRepository.updateTicket(
//                ticketEditRequest.getTicketid(),
//                ticketEditRequest.getCategoryid(),
//                ticketEditRequest.getPriorityid(),
//                ticketEditRequest.getAssigneeid(),
//                ticketEditRequest.getTicketStatusid(),
//                ticketEditRequest.getToBeUpdatedByUserid()
//        );
//
//        return new HttpResponse(OK.value(),
//                "Ticket '" + ticketEditRequest.getTicketid() + "' is updated successful.");
//
//    }

}
