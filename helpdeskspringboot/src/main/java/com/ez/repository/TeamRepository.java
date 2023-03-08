package com.ez.repository;

import com.ez.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    // search teams based on pageNumber, pageSize, searchTerm(id, name), assignmentMethod and status
    @Query(value = "" +
            " select a.id, " +
            "        a.name, " +
            "        case a.assignmentMethod " +
            "           when 'A' then 'Auto' " +
            "           else 'Manual' " +
            "        end as assignmentMethod, " +
            "        a.status " +
            " from team a " +
            " where concat(a.id,' ', a.name) like %?3% and " + // searchTerm
            "       ( " +
            "         case ?4 " + // assignmentMethod
            "           when '' then assignmentMethod like '%%' " +
            "           else assignmentMethod = ?4 " +
            "         end " +
            "       ) and " +
            "       ( " +
            "         case ?5 " + // status
            "           when '' then status like '%%' " +
            "           else status = ?5 " +
            "         end " +
            "       ) " +
            " limit ?1,?2 " // pageNumber and pageSize
            , nativeQuery = true)
    public List<Team> searchTeams(int pageNumber, int pageSize,
                                  String searchTerm, String assignmentMethod, String status);

    // calculate total of teams for pagination
    @Query(value = "" +
            " select count(a.id) as totalOfTeams " +
            " from team a " +
            " where concat(a.id,' ', a.name) like %?1% and " + // searchTerm
            "       ( " +
            "         case ?2 " + // assignmentMethod
            "           when '' then assignmentMethod like '%%' " +
            "           else assignmentMethod = ?2 " +
            "         end " +
            "       ) and " +
            "       ( " +
            "         case ?3 " + // status
            "           when '' then status like '%%' " +
            "           else status = ?3 " +
            "         end " +
            "       ) "
            , nativeQuery = true)
    public long getTotalOfTeams(String searchTerm, String assignmentMethod, String status);


}
