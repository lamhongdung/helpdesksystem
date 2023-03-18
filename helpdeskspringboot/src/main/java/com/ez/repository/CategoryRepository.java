package com.ez.repository;

import com.ez.entity.Category;
import com.ez.entity.Team;
import com.ez.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // search categories based on pageNumber, pageSize, searchTerm(id, name) and status
    @Query(value = "" +
            " select a.* " +
            " from category a " +
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) " +
            " limit :pageNumber,:pageSize " // pageNumber and pageSize
            , nativeQuery = true)
    public List<Category> searchCategories(@Param("pageNumber") int pageNumber,
                                           @Param("pageSize") int pageSize,
                                           @Param("searchTerm") String searchTerm,
                                           @Param("status") String status);

    // calculate total of categories for pagination
    @Query(value = "" +
            " select count(a.id) as totalOfCategories " +
            " from category a " +
            " where concat(a.id,' ', a.name) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) "
            , nativeQuery = true)
    public long getTotalOfCategories(@Param("searchTerm") String searchTerm,
                                     @Param("status") String status);

}
