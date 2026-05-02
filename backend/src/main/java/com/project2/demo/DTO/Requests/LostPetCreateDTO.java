package com.project2.demo.DTO.Requests;

import java.time.LocalDateTime;
import java.util.List;

import com.project2.demo.Enums.PetStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record LostPetCreateDTO(
    @NotBlank(message = "You must enter your pet's name")
    String petname,

    @NotBlank(message = "You must enter pet's species")
    String species,

    String breed,

    @NotBlank(message = "You must enter the location where your pet got lost")
    String location,

    LocalDateTime lostdate,

    @NotBlank(message = "You must enter your contact method")
    String contact,

    String description,

    @NotNull(message = "You must verify pet status") // Dùng NotNull cho Enum
    PetStatus status,

    LocalDateTime createdAt,
    
    List<String> lostpetImages


) {
    
}
