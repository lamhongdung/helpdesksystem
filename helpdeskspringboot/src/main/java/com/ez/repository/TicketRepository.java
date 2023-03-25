package com.ez.repository;

import com.ez.dto.DropdownResponse;
import com.ez.dto.TicketResponse;
import com.ez.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // get all ticket status.
    // 5 status + 1 dummy status:
    //  - All(dummy)
    //  - Open
    //  - Cancel
    //  - Assigned
    //  - Resolved
    //  - Closed
    @Query(value = "" +
            " select 0 as id, 'All' as description " +
            "  " +
            " union all " +
            "  " +
            " select a.statusid as id, a.name as description " +
            " from ticketStatus a "
            , nativeQuery = true)
    public List<DropdownResponse> getAllTicketStatus();

//    // get all creators.
//    // notes:
//    // interface DropdownResponse contains 2 fields:
//    //  - id: getId()
//    //  - description: getDescription()
//    @Query(value = "" +
//            " select 0 as id, 'All' as description " +
//            "  " +
//            " union all " +
//            "  " +
//            " select distinct a.creatorid as id, concat(COALESCE(b.id,''),' - ', COALESCE(b.lastName,''),' ', COALESCE(b.firstName,'')) as description " +
//            " from ticket a " +
//            "   left join user b on a.creatorid = b.id "
//            , nativeQuery = true)
//    public List<DropdownResponse> getAllCreatorsByAdmin();

    // get creators by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_ticket_getCreatorsByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getCreatorsByUserid(@Param("userid")  int userid);

    // get teams by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_ticket_getTeamsByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getTeamsByUserid(@Param("userid")  int userid);

    // get assignees by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_ticket_getAssigneesByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getAssigneesByUserid(@Param("userid")  int userid);

    // get categories by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_ticket_getCategoriesByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getCategoriesByUserid(@Param("userid")  int userid);

    // get priorities by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_ticket_getPrioritiesByUserid(:userid)}"
            , nativeQuery = true)
    public List<DropdownResponse> getPrioritiesByUserid(@Param("userid")  int userid);

    // get tickets by userid(and by user role).
    @Query(value = "{call sp_ticket_getTicketsByUserid(:userid, :searchTerm)}"
            , nativeQuery = true)
    public List<TicketResponse> getTicketsByUserid(@Param("userid")  long userid,
                                                   @Param("searchTerm")  String searchTerm);

    // calculate total of teams for pagination
    //
    // The "team" table contains columns:
    //      id, name, assignmentMethod, status.
    @Query(value = "{call sp_ticket_getTotalOfTicketsByUserid(:userid, :searchTerm)}"
            , nativeQuery = true)
    public long getTotalOfTickets(@Param("userid") long userid,
                                    @Param("searchTerm") String searchTerm);

}
