package com.project2.demo.DTO.Requests;

import jakarta.validation.constraints.Size;

public record ReviewUpdateDTO(
    @Size(min = 1, message = "Title cannot be empty")
    String comment,


    int rating
) {
    
}
