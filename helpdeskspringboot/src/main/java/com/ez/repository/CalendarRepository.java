package com.ez.repository;

import com.ez.entity.HDCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<HDCalendar, Long> {

    // get all calendars
    // parameters:
    //  - status = "": all(active + inactive) calendars
    //  - status = "Active": all active calendars
    //  - status = "Inactive": all inactive calendars
    @Query(value = "" +
            " select a.* " +
            " from calendar a " +
            " where ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) "
            , nativeQuery = true)
    public List<HDCalendar> getAllCalendars(@Param("status") String status);

    // search calendars based on pageNumber, pageSize, searchTerm(id, name) and status
    @Query(value = "" +
            " select a.* " +
            " from calendar a " +
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) " +
            " limit :pageNumber,:pageSize " // pageNumber and pageSize
            , nativeQuery = true)
    public List<HDCalendar> searchCalendars(@Param("pageNumber") int pageNumber,
                                            @Param("pageSize") int pageSize,
                                            @Param("searchTerm") String searchTerm,
                                            @Param("status") String status);

    // calculate total of calendars for pagination
    @Query(value = "" +
            " select count(a.id) as totalOfCalendars " + // total of calendars
            " from calendar a " +
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) "
            , nativeQuery = true)
    public long getTotalOfCalendars(@Param("searchTerm") String searchTerm,
                                    @Param("status") String status);

}
