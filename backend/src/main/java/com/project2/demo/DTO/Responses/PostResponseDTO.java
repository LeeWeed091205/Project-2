package com.project2.demo.DTO.Responses;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.project2.demo.Enums.PostCategory;

public record PostResponseDTO(
    Integer postId,
    String title,
    String content,
    LocalDateTime createdAt,

    //user
    String username,
    String avatarUrl,
    
    //post img
    List<String> postImages,

    //Categories
    Set<PostCategory> categories
) {
    
}
