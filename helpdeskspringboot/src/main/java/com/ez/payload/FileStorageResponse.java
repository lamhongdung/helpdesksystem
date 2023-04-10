package com.ez.payload;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class FileStorageResponse {

    private String name;
    private String url;
    private String type;
    private long size;

}
