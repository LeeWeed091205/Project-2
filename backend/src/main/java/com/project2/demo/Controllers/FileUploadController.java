package com.project2.demo.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project2.demo.Services.FileService;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileService fileService;

    @PostMapping("/upload-files")
    public ResponseEntity<?> uploadFiles(@RequestParam("files") MultipartFile[] files) throws IOException{
        //TODO: process POST request

            List<String> uploadedUrls = fileService.uploadImgs(files);
            return ResponseEntity.ok(uploadedUrls);
    }


}
