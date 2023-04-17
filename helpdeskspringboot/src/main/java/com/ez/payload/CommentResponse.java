package com.ez.payload;

import java.util.Date;

public interface CommentResponse {

    // "commentid" column
    Long getCommentid();

    // "commentDescription" column
    String getCommentDescription();

    // "commenterid" column
    Long getCommenterid();

    // "commenterName" column
    String getCommenterName();

    // "commenterPhone" column
    String getCommenterPhone();

    // "commenterEmail" column
    String getCommenterEmail();

    // "commenter" column.
    // commenter = commenterid + commenterName + commenterPhone + commenterEmail
    String getCommenter();

    // "commentDatetime" column
    Date getCommentDatetime();

    // "getCommentCustomFilename" column
    String getCommentCustomFilename();

    // "originalFilename" column
    String getOriginalFilename();

}
