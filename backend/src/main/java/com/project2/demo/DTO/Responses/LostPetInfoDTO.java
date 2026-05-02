package com.project2.demo.DTO.Responses;

import java.time.LocalDateTime;

import com.project2.demo.Enums.PetStatus;

public record LostPetInfoDTO(
    Integer lostpetId,
    Integer userId,
    String petname,
    String species,
    String location,
    PetStatus status,
    LocalDateTime lostdate
) {

}


