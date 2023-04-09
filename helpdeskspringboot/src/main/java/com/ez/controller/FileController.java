package com.ez.controller;


import com.ez.dto.FileStorageResponse;
import com.ez.dto.HttpResponse;
import com.ez.entity.FileStorage;
import com.ez.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@RestController
public class FileController {
    @Autowired
    private FileService fileService;

    // upload ticket's attached file to server
    @PostMapping("/upload")
    public ResponseEntity<FileStorage> uploadFile(@RequestParam("file") MultipartFile file)
            throws MaxUploadSizeExceededException, IOException {

        // save file to server local directory and
        // save file information to database
        FileStorage fileStorage = fileService.save(file);

        return new ResponseEntity<>(fileStorage, OK);
    }

//    @GetMapping("/files")
//    public ResponseEntity<List<FileStorageResponse>> getListFiles() {
//        List<FileStorageResponse> files = fileService.getAllFiles().map(dbFile -> {
//            String fileDownloadUri = ServletUriComponentsBuilder
//                    .fromCurrentContextPath()
////                    .path("/files/")
//                    .path("/download/")
//                    .path(dbFile.getCustomFilename())
//                    .toUriString();
//
//            return new FileStorageResponse(
//                    dbFile.getOriginalFilename(),
//                    fileDownloadUri,
//                    dbFile.getFileType(),
//                    0);
//        }).collect(Collectors.toList());
//
//        return ResponseEntity.status(HttpStatus.OK).body(files);
//    }

//    @GetMapping("/download/{id}")
//    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
//        FileStorage fileStorage = fileStorageService.getFile(id);
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileStorage.getName() + "\"")
//                .body(fileStorage.getData());
//    }

//    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
//
//        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), message), httpStatus);
//    }
}
