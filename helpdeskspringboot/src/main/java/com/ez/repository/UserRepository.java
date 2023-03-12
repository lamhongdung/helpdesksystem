package com.ez.repository;

import com.ez.dto.Supporter;
import com.ez.dto.SupporterDTO;
import com.ez.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, Long> {

    // get user by email
    public User findUserByEmail(String email);

    // check whether an user is inactive or not?
    // return:
    //  - not null: inactive user
    //  - null: not inactive user
    @Query(value =  "" +
            " select a.* " +
            " from user a " +
            " where a.email =?1 and a.status = 'Inactive' "
            ,nativeQuery = true)
    public User isInactiveUser(String email);

    // search users by searchTerm, role and status.
    @Query(value =  "" +
            " select a.* " +
            " from user a " +
            " where concat(a.id,' ', a.email,' ', a.firstName,' ', a.lastName,' ', a.phone) like %?3% and " + // searchTerm
            "       ( " +
            "         case ?4 " + // role
            "           when '' then role like '%%' " +
            "           else role = ?4 " +
            "         end " +
            "       ) and " +
            "       ( " +
            "         case ?5 " + // status
            "           when '' then status like '%%' " +
            "           else status = ?5 " +
            "         end " +
            "       ) " +
            " limit ?1,?2 " // pageNumber and pageSize
            ,nativeQuery = true)
    public List<User> searchUsers(int pageNumber, int pageSize, String searchTerm, String role, String status);

    // calculate total of users for pagination
    @Query(value =  "" +
                    " select count(a.id) as totalOfUsers " +
                    " from user a " +
                    " where concat(a.id,' ', a.email,' ', a.firstName,' ', a.lastName,' ', a.phone) like %?1% and " + // searchTerm
                    "       ( " +
                    "         case ?2 " + // role
                    "           when '' then role like '%%' " +
                    "           else role = ?2 " +
                    "         end " +
                    "       ) and " +
                    "       ( " +
                    "         case ?3 " + // status
                    "           when '' then status like '%%' " +
                    "           else status = ?3 " +
                    "         end " +
                    "       ) "
            ,nativeQuery = true)
    public long getTotalOfUsers(String searchTerm, String role, String status);

}
