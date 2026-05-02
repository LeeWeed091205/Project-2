package com.project2.demo.DTO.Responses;

public record LoginResponseDTO(
    String token,
    String username,
    String avatarUrl,
    String role,
    Integer id // ID người dùng
) {
    
}
