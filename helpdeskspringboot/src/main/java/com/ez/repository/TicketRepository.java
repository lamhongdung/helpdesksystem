package com.ez.repository;

import com.ez.dto.DropdownResponse;
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

    // get all categories.
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "" +
            " select 0 as id, 'All' as description " +
            "  " +
            " union all " +
            "  " +
            " select a.id, concat(a.name,' - ', a.status) as description " +
            " from category a "
            , nativeQuery = true)
    public List<DropdownResponse> getAllCategories();

    // get all priorities.
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "" +
            " select 0 as id, 'All' as description " +
            "  " +
            " union all " +
            "  " +
            " select a.id, concat(a.name,' - ', a.status) as description " +
            " from priority a "
            , nativeQuery = true)
    public List<DropdownResponse> getAllPriorities();

}
