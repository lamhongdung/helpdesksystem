package com.ez.service;

import com.ez.entity.Comment;
import com.ez.payload.CommentResponse;
import com.ez.payload.DropdownResponse;
import com.ez.payload.HttpResponse;
import com.ez.payload.TicketCreateRequest;
import com.ez.repository.CategoryRepository;
import com.ez.repository.CommentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@Service
public class CommentService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private CommentRepository commentRepository;

    // get all comments by ticket id
    public List<CommentResponse> getAllCommentsByTicketid(long ticketid) {

        LOGGER.info("get all comments by ticket id");

        return commentRepository.getAllCommentsByTicketid(ticketid);
    }

    // add a new comment.
    public HttpResponse addComment(Comment comment) {

        LOGGER.info("add a new comment");
        LOGGER.info("Comment is sent from client: " + comment.toString());

        // save a new comment into the "comment" table in database.
        commentRepository.save(new Comment(
                comment.getTicketid(),
                comment.getCommentDescription(),
                comment.getCommenterid(),
                comment.getCommentCustomFilename()));

        return new HttpResponse(OK.value(), "Comment is added successful!");
    }

}
