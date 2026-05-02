package com.project2.demo.DTO.Requests;

import jakarta.validation.constraints.NotBlank;

public record UserLoginDTO(
    @NotBlank(message = "username can not be empty")
    String username,

    @NotBlank(message = "password can not be empty")
    String password
) {
    
}
