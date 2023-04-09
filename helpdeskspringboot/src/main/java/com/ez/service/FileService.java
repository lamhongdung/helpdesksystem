package com.ez.service;

import com.ez.entity.FileStorage;
import com.ez.repository.FileRepository;
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
public class FileService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    // file storage location.
    // ex: "D:\helpdesksystem\fileStorage"
    @Value("${download.fileStorageLocation}")
    private String fileStorageLocation;

    @Autowired
    private FileRepository fileRepository;

    // save file to server local directory and
    // save file information to database
    public FileStorage save(MultipartFile file) throws IOException {

        // file extension(without point mark). ex: jpg, txt,...
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
        // ex: customFilename = 20230405141319_9188e7cd-feb3-4fe3-9084-92fad9c1f98d.jpg
        customFilename = currentDatetime + "_" + UUID.randomUUID() + "." + fileExtension;

        // fileStorageLocation = "D:\\helpdesksystem\\fileStorage".
        // customFilename = yyyyMMddHHmmss + UUID + extension.
        // ex: "D:\helpdesksystem\fileStorage\20230405141319_9188e7cd-feb3-4fe3-9084-92fad9c1f98d.jpg"
        Path filePath = Paths.get(fileStorageLocation + "/" + customFilename);

        // copy file to the folder "filePath" in server machine
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // save file information to database
        FileStorage fileStorage = new FileStorage(customFilename,
                file.getOriginalFilename(), file.getContentType());

        // save uploaded file server local machine and
        // also save file information into database
        return fileRepository.save(fileStorage);

    } // end of save()

//    public FileStorage getFile(long id) {
//        return fileRepository.findById(id).get();
//    }
//
//    public Stream<FileStorage> getAllFiles() {
//        return fileRepository.findAll().stream();
//    }
}
