package com.project2.demo.DTO.Requests;

import java.util.List;
import java.util.Set;

import com.project2.demo.Enums.PostCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;



public record PostCreateDTO(
    @NotBlank(message = "You must fill the post's title")
    String title,

    String content,

    @NotEmpty(message = "You must select at least one category")
    Set<PostCategory> categories,

    List<String> postImages
) {
    
}
