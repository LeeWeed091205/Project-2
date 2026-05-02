package com.project2.demo.DTO.Requests;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public record ClinicCreateDTO(
    @NotBlank(message = "Clinic name can not be null")
    String name,
    String phone,

    @NotBlank(message = "Clinic's address can not be null")
    String address,

    String description,

    List<String> clinicImages
) {

    
}
