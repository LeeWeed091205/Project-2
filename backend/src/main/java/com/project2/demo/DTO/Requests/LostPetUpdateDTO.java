package com.project2.demo.DTO.Requests;

import java.time.LocalDateTime;
import java.util.List;

import com.project2.demo.Enums.PetStatus;

public record LostPetUpdateDTO(
    String petname,
    String species,
    String breed,
    String location,
    LocalDateTime lostdate,
    String contact,
    String description,
    PetStatus status,
    List<String> lostpetImages
) {
    
}
