package com.ez.dto;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class TicketRequest {

    @Min(value = 1, message = "Value of creator id must be greater than or equal to 1")
    private long creatorid;

    @Size(min = 1, message = "Please input a subject")
    private String subject;

    @Size(min = 1, message = "Please input a content")
    private String content;

    @Min(value = 1, message = "Value of team id must be greater than or equal to 1")
    private long teamid;

    @Min(value = 1, message = "Value of category id must be greater than or equal to 1")
    private long categoryid;

    @Min(value = 1, message = "Value of priority id must be greater than or equal to 1")
    private long priorityid;

    // - hasAttachedFile = true: there is attached file.
    // - hasAttachedFile = false: there is no attached file.
//    @Pattern(regexp = "1|0", message = "Value of the hasAttachedFile must be TRUE or FALSE")
    private boolean hasAttachedFile;
//    private String aaa;

    // - customFilename = "": if user did not attach file.
    // - customFilename = timestamp + UUID + extension(ex: .jpg): if user has attached file
    // ex: customFilename = "20230405143231_3ed7c8ea-114e-4c1f-a3d3-8e5a439e9aff.jpg".
    private String customFilename;

}
