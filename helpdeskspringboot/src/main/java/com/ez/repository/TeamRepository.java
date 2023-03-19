package com.ez.repository;

import com.ez.dto.SupporterResponse;
import com.ez.dto.TeamResponse;
import com.ez.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface TeamRepository extends JpaRepository<Team, Long> {

    // search teams based on pageNumber, pageSize, searchTerm(id, team name),
    // assignmentMethod and status.
    //
    // The "team" table contains columns:
    //      id, name, assignmentMethod, status.
    @Query(value = "" +
            " select a.id as id, " + // id
            "        a.name as name, " + // Name
            "        case a.assignmentMethod " + // assignmentMethod
            "           when 'A' then 'Auto' " +
            "           else 'Manual' " +
            "        end as assignmentMethod, " +
//            "        a.calendarid as calendarid, " + // calendarid
//            "        COALESCE(b.name, '') as calendarName, " + // calendarName
            "        a.status as status " + // team status
            " from team a " +
//            "   left join calendar b on a.calendarid = b.id " +
//            " where concat(a.id,' ', a.name,' ', COALESCE(b.name, '')) like %:searchTerm% and " + // searchTerm
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :assignmentMethod " + // assignmentMethod
            "           when '' then a.assignmentMethod like '%%' " +
            "           else a.assignmentMethod = :assignmentMethod " +
            "         end " +
            "       ) and " +
            "       ( " +
            "         case :status " + // status
            "           when '' then a.status like '%%' " +
            "           else a.status = :status " +
            "         end " +
            "       ) " +
            " limit :pageNumber, :pageSize " // pageNumber and pageSize
            , nativeQuery = true)
    public List<TeamResponse> searchTeams(@Param("pageNumber") int pageNumber,
                                          @Param("pageSize") int pageSize,
                                          @Param("searchTerm") String searchTerm,
                                          @Param("assignmentMethod") String assignmentMethod,
                                          @Param("status") String status);

    // calculate total of teams for pagination
    //
    // The "team" table contains columns:
    //      id, name, assignmentMethod, status.
    @Query(value = "" +
            " select count(a.id) as totalOfTeams " + // total of teams
            " from team a " +
//            "   left join calendar b on a.calendarid = b.id " +
//            " where concat(a.id,' ', a.name, ' ', COALESCE(b.name, '')) like %:searchTerm% and " + // searchTerm
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :assignmentMethod " + // assignmentMethod
            "           when '' then a.assignmentMethod like '%%' " +
            "           else a.assignmentMethod = :assignmentMethod " +
            "         end " +
            "       ) and " +
            "       ( " +
            "         case :status " + // status
            "           when '' then a.status like '%%' " +
            "           else a.status = :status " +
            "         end " +
            "       ) "
            , nativeQuery = true)
    public long getTotalOfTeams(@Param("searchTerm") String searchTerm,
                                @Param("assignmentMethod") String assignmentMethod,
                                @Param("status") String status);

    // get all active supporters
    @Query(value = "" +
            " select a.id as id, " + // supporter id(user id)
            "        concat(a.id, ' - ', a.lastName, ' ', a.firstName, ' - ', a.email, ' - ', a.status) as description " +
            " from user a " +
            " where a.role = 'ROLE_SUPPORTER' and a.status = 'Active' "
            , nativeQuery = true)
    public List<SupporterResponse> getActiveSupporters();

    // save teamid and supporterid into the "teamSupporter" table
    @Modifying
    @Query(value = "" +
            " insert into teamSupporter(teamid, supporterid) " +
            " values(:teamid, :supporterid) "
            , nativeQuery = true)
    void saveTeamSupporter(@Param("teamid") long teamid,
                           @Param("supporterid") long supporterid);

    // get selected(assigned) supporters.
    //
    // The "teamSupporter" table contains columns:
    //      teamid, supporterid.
    // The "user" table contains columns:
    //      id, email, password, firstName, lastName, phone, address, role, status
    @Query(value = "" +
            " select a.supporterid as id, " + // supporter id
            "        concat(COALESCE(b.id,''),' - ', COALESCE(b.lastName,''), ' ', COALESCE(b.firstName,''), ' - ', COALESCE(b.email,''), ' - ', COALESCE(b.status,'')) as description " +
            " from teamSupporter a " +
            "   left join user b on a.supporterid = b.id " +
            " where a.teamid = :teamid "
            , nativeQuery = true)
    public List<SupporterResponse> getSelectedSupporters(@Param("teamid") long teamid);

    // delete the "teamSupporter" table by teamid.
    // delete old data before re-add new data.
    // this method is used for "Edit team" function
    @Modifying
    @Query(value = "" +
            " delete from teamSupporter " +
            " where teamid = :teamid "
            , nativeQuery = true)
    void deleteTeamSupporter(@Param("teamid") long teamid);

}
