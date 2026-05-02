package com.project2.demo.DTO.Requests;

import jakarta.validation.constraints.NotBlank;

public record UserUpdatePasswordDTO(
    @NotBlank
    String oldpassword,

    @NotBlank
    String newpassword
) {
    
}
