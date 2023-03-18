package com.ez.repository;

import com.ez.entity.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriorityRepository extends JpaRepository<Priority, Long> {

    // search priorities based on pageNumber, pageSize, searchTerm(id, name), resolveInOpt, resolveIn and status
    @Query(value = "" +
            " select a.* " +
            " from priority a " +
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :resolveInOpt " + // resolveInOpt
            "           when 'gt' then resolveIn >= :resolveIn " + // resolveIn
            "           when 'eq' then resolveIn = :resolveIn " + // resolveIn
            "           else resolveIn <= :resolveIn " + // resolveIn
            "         end " +
            "       ) and " +
            "       ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) " +
            " limit :pageNumber,:pageSize " // pageNumber and pageSize
            , nativeQuery = true)
    public List<Priority> searchPriorities(@Param("pageNumber") int pageNumber,
                                           @Param("pageSize") int pageSize,
                                           @Param("searchTerm") String searchTerm,
                                           @Param("resolveInOpt") String resolveInOpt,
                                           @Param("resolveIn") long resolveIn,
                                           @Param("status") String status);

    // calculate total of priorities for pagination
    @Query(value = "" +
            " select count(a.id) as totalOfPriorities " +
            " from priority a " +
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :resolveInOpt " + // resolveInOpt
            "           when 'gt' then resolveIn >= :resolveIn " + // resolveIn
            "           when 'eq' then resolveIn = :resolveIn " + // resolveIn
            "           else resolveIn <= :resolveIn " + // resolveIn
            "         end " +
            "       ) and " +
            "       ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) "
            , nativeQuery = true)
    public long getTotalOfPriorities(@Param("searchTerm") String searchTerm,
                                     @Param("resolveInOpt") String resolveInOpt,
                                     @Param("resolveIn") long resolveIn,
                                     @Param("status") String status);

}
