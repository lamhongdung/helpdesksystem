package com.ez.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HttpResponse {
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM-dd-yyyy hh:mm:ss", timezone = "America/New_York")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM-dd-yyyy hh:mm:ss", timezone = "UTC")
    private Date timeStamp;
    private int statusCode; // ex: 200, 201, 400, 500, ...
    private String message; // ex:" Your request was successful"

    public HttpResponse(int statusCode, String message) {

        this.timeStamp = new Date();
        this.statusCode = statusCode;
        this.message = message;
    }

}
