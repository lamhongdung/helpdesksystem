package com.ez.repository;

import com.ez.dto.Supporter;
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

    // search teams based on pageNumber, pageSize, searchTerm(id, name), assignmentMethod and status
    @Query(value = "" +
            " select a.id as id, " +
            "        a.name as name, " +
            "        case a.assignmentMethod " +
            "           when 'A' then 'Auto' " +
            "           else 'Manual' " +
            "        end as assignmentMethod, " +
            "        a.status as status " +
            " from team a " +
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :assignmentMethod " + // assignmentMethod
            "           when '' then assignmentMethod like '%%' " +
            "           else assignmentMethod = :assignmentMethod " +
            "         end " +
            "       ) and " +
            "       ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) " +
            " limit :pageNumber, :pageSize " // pageNumber and pageSize
            , nativeQuery = true)
    public List<Team> searchTeams(@Param("pageNumber") int pageNumber,
                                  @Param("pageSize") int pageSize,
                                  @Param("searchTerm") String searchTerm,
                                  @Param("assignmentMethod") String assignmentMethod,
                                  @Param("status") String status);

    // calculate total of teams for pagination
    @Query(value = "" +
            " select count(a.id) as totalOfTeams " +
            " from team a " +
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :assignmentMethod " + // assignmentMethod
            "           when '' then assignmentMethod like '%%' " +
            "           else assignmentMethod = :assignmentMethod " +
            "         end " +
            "       ) and " +
            "       ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) "
            , nativeQuery = true)
    public long getTotalOfTeams(@Param("searchTerm") String searchTerm,
                                @Param("assignmentMethod") String assignmentMethod,
                                @Param("status") String status);

    // get active supporters
    @Query(value = "" +
            " select a.id as id, " +
            "        concat(a.id, ' - ', a.lastName, ' ', a.firstName, ' - ', a.email) as idFullnameEmail " +
            " from user a " +
            " where a.role = 'ROLE_SUPPORTER' and a.status = 'Active' "
            , nativeQuery = true)
    public List<Supporter> getActiveSupporters();

    // save teamid and supporterid into the "teamSupporter" table
    @Modifying
    @Query(value = "" +
            " insert into teamSupporter(teamid, supporterid) " +
            " values(:teamid, :supporterid) "
            , nativeQuery = true)
    void saveTeamSupporter(@Param("teamid") long teamid,
                           @Param("supporterid") long supporterid);

    // get selected supporters
    @Query(value = "" +
            " select a.supporterid as id, " +
            "        concat(b.id,' - ', b.lastName, ' ', b.firstName, ' - ', b.email) as idFullnameEmail " +
            " from teamSupporter a " +
            "   left join user b on a.supporterid = b.id " +
            " where a.teamid = :teamid "
            , nativeQuery = true)
    public List<Supporter> getSelectedSupporters(@Param("teamid") long teamid);

    // delete the "teamSupporter" table by teamid
    @Modifying
    @Query(value = "" +
            " delete from teamSupporter " +
            " where teamid = :teamid "
            , nativeQuery = true)
    void deleteTeamSupporter(@Param("teamid") long teamid);

}
