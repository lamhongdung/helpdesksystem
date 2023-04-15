package com.ez.repository;

import com.ez.entity.FileStorage;
import com.ez.payload.FileResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<FileStorage, Long> {

    // get file information
    @Query(value = "" +
            " select    a.id as id, " +
            "           a.customFilename as customFilename, " +
            "           a.originalFilename as originalFilename, " +
            "           a.fileType as fileType " +
            " from fileStorage a " +
            " where a.customFilename = :customFilename "
            , nativeQuery = true)
    public FileStorage getOriginalFilename(@Param("customFilename") String customFilename);

}
