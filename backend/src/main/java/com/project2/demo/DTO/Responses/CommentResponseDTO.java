package com.project2.demo.DTO.Responses;

import java.time.LocalDateTime;

public record CommentResponseDTO(
    Integer commentId,
    String content,
    LocalDateTime createdAt,

    Integer userId,
    String username,
    String avatarUrl

) {
    
}
