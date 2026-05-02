package com.project2.demo.DTO.Responses;

import java.time.LocalDateTime;
import java.util.List;

public record ClinicDetailInfoDTO(
    Integer clinicId,
    String name,
    String address,
    String description,
    String phone,
    LocalDateTime createdAt,
    List<String> clinicImages
) {
    
}
