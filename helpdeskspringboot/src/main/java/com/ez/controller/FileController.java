package com.ez.controller;


import com.ez.entity.FileStorage;
import com.ez.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static java.nio.file.Paths.get;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;
import static org.springframework.http.HttpStatus.*;

@RestController
public class FileController {

    @Value("${download.fileStorageLocation}")
    private String fileStorageLocation;

    @Autowired
    private FileService fileService;

    // upload ticket's attached file to server
    @PostMapping("/upload")
    public ResponseEntity<FileStorage> uploadFile(@RequestParam("file") MultipartFile file)
            throws MaxUploadSizeExceededException, IOException {

        // save file to server local directory(ex: D:\helpdesksystem\fileStorage\) and
        // save mapping filename to fileStorage table in database
        FileStorage fileStorage = fileService.save(file);

        return new ResponseEntity<>(fileStorage, OK);
    }

    @GetMapping("/download/{customFilename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String customFilename)
            throws IOException {

        FileStorage fileStorage;

        Path filePath = get(fileStorageLocation).toAbsolutePath().normalize().resolve(customFilename);

        if(!Files.exists(filePath)) {
            throw new FileNotFoundException(customFilename + " was not found on the server");
        }

        fileStorage = fileService.getFileStorage(customFilename);

        Resource resource = new UrlResource(filePath.toUri());

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("customFilename", customFilename);
        httpHeaders.add("originalFilename", fileStorage.getOriginalFilename() );
        httpHeaders.add(CONTENT_DISPOSITION,
                "attachment;customFilename=" + resource.getFilename());

        return ResponseEntity
                .ok()
//                .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                .contentType(MediaType.parseMediaType(fileStorage.getFileType()))
                .headers(httpHeaders)
                .body(resource);
    }

}
