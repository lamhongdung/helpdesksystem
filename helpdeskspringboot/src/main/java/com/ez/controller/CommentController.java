package com.ez.controller;

import com.ez.entity.Comment;
import com.ez.exception.BadDataException;
import com.ez.payload.*;
import com.ez.service.CommentService;
import com.ez.service.TicketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class CommentController {
    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    CommentService commentService;

    // get all comments by ticket id.
    @GetMapping("/{ticketid}/comments")
    // all authenticated users can access this resource
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPORTER','ROLE_ADMIN')")
    public ResponseEntity<List<CommentResponse>> getAllCommentsByTicketid(
            @PathVariable Long ticketid) {

        // get all comments by ticket id
        List<CommentResponse> commentResponses = commentService.getAllCommentsByTicketid(ticketid);

        return new ResponseEntity<>(commentResponses, OK);
    }

    //
    // add a new comment.
    @PostMapping("tickets/{ticketid}/comment-add")
    // all authenticated users can access this resource
    public ResponseEntity<HttpResponse> addComment(
            @RequestBody @Valid Comment comment,
            BindingResult bindingResult) throws BindException {

        LOGGER.info("validate data");

        // if comment data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.info("Comment data is invalid");

            throw new BindException(bindingResult);
        }

        // add comment
        HttpResponse httpResponse = commentService.addComment(comment);

        return new ResponseEntity<>(httpResponse, OK);
    }


}
