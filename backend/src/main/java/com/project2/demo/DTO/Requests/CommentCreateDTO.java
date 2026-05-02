package com.project2.demo.DTO.Requests;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateDTO(
    @NotBlank(message = "comment can not be blank")
    String content
) {
    
}
