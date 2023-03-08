package com.ez.repository;

import com.ez.entity.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriorityRepository extends JpaRepository<Priority, Long> {

    // search priorities based on pageNumber, pageSize, searchTerm(id, name), resolveInOpt, resolveIn and status
    @Query(value = "" +
            " select a.* " +
            " from priority a " +
            " where concat(a.id,' ', a.name) like %?3% and " + // searchTerm
            "       ( " +
            "         case ?4 " + // resolveInOpt
            "           when 'gt' then resolveIn >= ?5 " + // resolveIn
            "           when 'eq' then resolveIn = ?5 " + // resolveIn
            "           else resolveIn <= ?5 " + // resolveIn
            "         end " +
            "       ) and " +
            "       ( " +
            "         case ?6 " + // status
            "           when '' then status like '%%' " +
            "           else status = ?6 " +
            "         end " +
            "       ) " +
            " limit ?1,?2 " // pageNumber and pageSize
            , nativeQuery = true)
    public List<Priority> searchPriorities(int pageNumber, int pageSize,
                                           String searchTerm, String resolveInOpt, long resolveIn, String status);

    // calculate total of priorities for pagination
    @Query(value = "" +
            " select count(a.id) as totalOfPriorities " +
            " from priority a " +
            " where concat(a.id,' ', a.name) like %?1% and " + // searchTerm
            "       ( " +
            "         case ?2 " + // resolveInOpt
            "           when 'gt' then resolveIn >= ?3 " + // resolveIn
            "           when 'eq' then resolveIn = ?3 " + // resolveIn
            "           else resolveIn <= ?3 " + // resolveIn
            "         end " +
            "       ) and " +
            "       ( " +
            "         case ?4 " + // status
            "           when '' then status like '%%' " +
            "           else status = ?4 " +
            "         end " +
            "       ) "
            , nativeQuery = true)
    public long getTotalOfPriorities(String searchTerm, String resolveInOpt, long resolveIn, String status);

}
