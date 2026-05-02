package com.project2.demo.DTO.Responses;

public record UserProfileResponseDTO(
    String username,
    String email,
    String bio,
    String avatarUrl
){
    
}
