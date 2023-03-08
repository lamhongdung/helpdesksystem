package com.ez.repository;

import com.ez.entity.Category;
import com.ez.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // search categories based on pageNumber, pageSize, searchTerm(id, name) and status
    @Query(value = "" +
            " select a.* " +
            " from category a " +
            " where concat(a.id,' ', a.name) like %?3% and " + // searchTerm
            "       ( " +
            "         case ?4 " + // status
            "           when '' then status like '%%' " +
            "           else status = ?4 " +
            "         end " +
            "       ) " +
            " limit ?1,?2 " // pageNumber and pageSize
            , nativeQuery = true)
    public List<Category> searchCategories(int pageNumber, int pageSize, String searchTerm, String status);

    // calculate total of categories for pagination
    @Query(value = "" +
            " select count(a.id) as totalOfCategories " +
            " from category a " +
            " where concat(a.id,' ', a.name) like %?1% and " + // searchTerm
            "       ( " +
            "         case ?2 " + // status
            "           when '' then status like '%%' " +
            "           else status = ?2 " +
            "         end " +
            "       ) "
            , nativeQuery = true)
    public long getTotalOfCategories(String searchTerm, String status);

}
