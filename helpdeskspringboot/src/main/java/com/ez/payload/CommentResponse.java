package com.ez.payload;

import java.util.Date;

public interface CommentResponse {

    // "id" column
    Long getCommentid();

    // "name" column
    String getCommentDescription();

    Long getCommenterid();
    String getCommenterName();

    String getCommenterPhone();
    String getCommenterEmail();
    String getCommenter();
    Date getCommentDatetime();

    String getCustomFilename();
    String getOriginalFilename();

}
