package com.project2.demo.DTO.Requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ReviewCreateDTO(
    @NotBlank(message = "comment can not be empty")
    String comment,

    @Min(1)
    @Max(5)
    int rating
) {
    
}
