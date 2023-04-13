package com.ez.payload;

import lombok.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class TicketEditRequest {

    @Min(value = 1, message = "Value of ticket id must be greater than or equal to 1")
    private long ticketid;

    @Min(value = 1, message = "Value of 'last update by user id' must be greater than or equal to 1")
    private long lastUpdateByUserid;

    @Min(value = 1, message = "Value of category id must be greater than or equal to 1")
    private long categoryid;

    @Min(value = 1, message = "Value of priority id must be greater than or equal to 1")
    private long priorityid;

    @Min(value = 1, message = "Value of assignee id must be greater than or equal to 1")
    private long assigneeid;

    @Min(value = 1, message = "Value of ticket status id must be greater than or equal to 1")
    private long ticketStatusid;
}
