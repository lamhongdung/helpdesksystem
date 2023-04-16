package com.ez.service;

import com.ez.payload.CommentResponse;
import com.ez.payload.DropdownResponse;
import com.ez.repository.CategoryRepository;
import com.ez.repository.CommentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

}
