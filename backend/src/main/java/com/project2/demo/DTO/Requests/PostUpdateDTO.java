package com.project2.demo.DTO.Requests;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.project2.demo.Enums.PostCategory;

import jakarta.validation.constraints.Size;



public record PostUpdateDTO(
    @Size(min = 1, message = "Title cannot be empty")
    String title,

    @Size(min = 1, message = "Title cannot be empty")
    String content,
    LocalDateTime updatedAt,
    Set<PostCategory> categories,
    List<String> postImages
) {
    
}
