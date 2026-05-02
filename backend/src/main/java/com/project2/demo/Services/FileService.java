package com.project2.demo.Services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileService {
    private final Cloudinary cloudinary;

    public List<String> uploadImgs(MultipartFile[] files) throws IOException{
        List<String> imgUrls = new ArrayList<>();

        for (MultipartFile file : files){
            if(!file.isEmpty()){
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(),ObjectUtils.asMap("folder","post_image"));
                String url = uploadResult.get("secure_url").toString();
                imgUrls.add(url);

            }
        }

        return imgUrls;
    }
}
