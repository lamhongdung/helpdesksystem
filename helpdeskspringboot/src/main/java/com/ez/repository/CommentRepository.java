package com.ez.repository;

import com.ez.entity.Comment;
import com.ez.entity.Ticket;
import com.ez.payload.CommentResponse;
import com.ez.payload.DropdownResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface CommentRepository  extends JpaRepository<Comment, Long> {

    // get creators by userid(and by user role).
    // notes:
    // interface DropdownResponse contains 2 fields:
    //  - id: getId()
    //  - description: getDescription()
    @Query(value = "{call sp_getAllCommentsByTicketid(:ticketid)}"
            , nativeQuery = true)
    public List<CommentResponse> getAllCommentsByTicketid(@Param("ticketid")  long ticketid);


}
