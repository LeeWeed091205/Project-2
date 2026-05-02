package com.project2.demo.DTO.Requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRegisterDTO(
    @NotBlank(message ="username can not be empty")
    String username,

    @NotBlank(message = "password can not be empty")
    String password,

    @Email
    @NotBlank(message ="Email can not be empty")
    String email
) {
    
}
