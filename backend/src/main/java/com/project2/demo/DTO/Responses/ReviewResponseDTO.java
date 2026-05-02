package com.project2.demo.DTO.Responses;

import java.time.LocalDateTime;

public record ReviewResponseDTO(
    Integer reviewId,
    int rating,
    String comment,
    LocalDateTime createdAt,

    String username,
    String avatarUrl,
    

    String clinicname
) {
    
}
