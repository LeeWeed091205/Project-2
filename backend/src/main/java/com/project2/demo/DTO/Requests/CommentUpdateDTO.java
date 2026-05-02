package com.project2.demo.DTO.Requests;

import jakarta.validation.constraints.NotBlank;

public record CommentUpdateDTO(
    @NotBlank(message = "Comment can not be blank")
    String content
) {
    
}
