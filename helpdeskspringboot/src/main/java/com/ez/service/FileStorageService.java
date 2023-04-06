package com.ez.service;

import com.ez.entity.FileStorage;
import com.ez.repository.FileStorageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class FileStorageService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    // file storage location.
    // ex: "D:\helpdesksystem\fileStorage"
    @Value("${download.fileStorageLocation}")
    private String fileStorageLocation;

    @Autowired
    private FileStorageRepository fileStorageRepository;

    // save file to server local directory and
    // save file information to database
    public FileStorage save(MultipartFile file) throws IOException {

        // file extension. ex: jpg, txt,...
        String fileExtension;

        // customFilename = yyyyMMddHHmmss + UUID + extension
        String customFilename;

        // current datetime in string
        String currentDatetime;
        Date date = new Date();
        SimpleDateFormat datetimeFormat = new SimpleDateFormat("yyyyMMddHHmmss");

        // get current datetime in string "yyyyMMddHHmmss"
        currentDatetime = datetimeFormat.format(date);

        // get file extension(ex: jpg, txt,...)
        fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());

        // customFilename = yyyyMMddHHmmss + UUID + extension
        // ex: customerFilename = 20230405141319_9188e7cd-feb3-4fe3-9084-92fad9c1f98d.jpg
        customFilename = currentDatetime + "_" + UUID.randomUUID() + "." + fileExtension;

        // fileStorageLocation = "D:\\helpdesksystem\\fileStorage".
        // customFilename = yyyyMMddHHmmss + UUID + extension.
        // ex: "D:\helpdesksystem\fileStorage\20230405141319_9188e7cd-feb3-4fe3-9084-92fad9c1f98d.jpg"
        Path filePath = Paths.get(fileStorageLocation + "/" + customFilename);

        // copy file to the folder "filePath" in server machine
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // save file info to database
        FileStorage fileStorage = new FileStorage(customFilename, file.getOriginalFilename(), file.getContentType());

        return fileStorageRepository.save(fileStorage);

    } // end of save()

//    // save file to database
//    public FileStorage save(MultipartFile file) throws IOException {
//
//        // ex: fileName = "abc.txt"
//        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
//
////        FileStorage fileStorage = new FileStorage(fileName, file.getContentType(), file.getBytes());
//        FileStorage fileStorage = new FileStorage(fileName, file.getContentType(), null);
//
//
////        StringUtils.
//        return fileStorageRepository.save(fileStorage);
//    }

    public FileStorage getFile(long id) {
        return fileStorageRepository.findById(id).get();
    }

    public Stream<FileStorage> getAllFiles() {
        return fileStorageRepository.findAll().stream();
    }
}
