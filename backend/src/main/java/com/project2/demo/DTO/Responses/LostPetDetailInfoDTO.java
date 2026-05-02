package com.project2.demo.DTO.Responses;

import java.time.LocalDateTime;
import java.util.List;

import com.project2.demo.Enums.PetStatus;

public record LostPetDetailInfoDTO(
    Integer lostpetId,
    Integer userId,
    String petname,
    String species,
    String breed,
    String location,
    LocalDateTime lostdate,
    String contact,
    String description,
    PetStatus status,
    LocalDateTime createdAt,
    List<String> lostpetImages
) {
    
}
