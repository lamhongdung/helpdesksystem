package com.ez.repository;

import com.ez.entity.User;
import com.ez.payload.DropdownResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, Long> {

    // get user by email
    public User findUserByEmail(String email);

    // check whether a user is inactive or not?
    // return:
    //  - not null: inactive user
    //  - null: not inactive user
    @Query(value =  "" +
            " select a.* " +
            " from user a " +
            " where a.email = :email and a.status = 'Inactive' "
            ,nativeQuery = true)
    public User isInactiveUser(@Param("email") String email);

    // search users by searchTerm, role and status.
    @Query(value =  "" +
            " select a.* " +
            " from user a " +
            " where concat(a.id,' ', a.email,' ', a.firstName,' ', a.lastName,' ', a.phone) like %:searchTerm% and " + // searchTerm
            "       ( " +
            "         case :role " + // role
            "           when '' then role like '%%' " +
            "           else role = :role " +
            "         end " +
            "       ) and " +
            "       ( " +
            "         case :status " + // status
            "           when '' then status like '%%' " +
            "           else status = :status " +
            "         end " +
            "       ) " +
            " limit :pageNumber,:pageSize " // pageNumber and pageSize
            ,nativeQuery = true)
    public List<User> searchUsers(@Param("pageNumber") int pageNumber,
                                  @Param("pageSize") int pageSize,
                                  @Param("searchTerm") String searchTerm,
                                  @Param("role") String role,
                                  @Param("status") String status);

    // calculate total of users for pagination
    @Query(value =  "" +
                    " select count(a.id) as totalOfUsers " +
                    " from user a " +
                    " where concat(a.id,' ', a.email,' ', a.firstName,' ', a.lastName,' ', a.phone) like %:searchTerm% and " + // searchTerm
                    "       ( " +
                    "         case :role " + // role
                    "           when '' then role like '%%' " +
                    "           else role = :role " +
                    "         end " +
                    "       ) and " +
                    "       ( " +
                    "         case :status " + // status
                    "           when '' then status like '%%' " +
                    "           else status = :status " +
                    "         end " +
                    "       ) "
            ,nativeQuery = true)
    public long getTotalOfUsers(@Param("searchTerm") String searchTerm,
                                @Param("role") String role,
                                @Param("status") String status);

    //
    // get supporters + 1 dummy
    //
    // parameters:
    // - status:
    //      = 0: all supporters(active + inactive) + 1 dummy
    //      = 1: active supporters + 1 dummy
    //      = 2: inactive supporters + 1 dummy
    // return:
    //  - id
    //  - description = id + fullname + status
    @Query(value = "{call sp_getSupportersByStatus(:status)}"
            ,nativeQuery = true)
    public List<DropdownResponse> getSupporters(@Param("status") long status);

}
