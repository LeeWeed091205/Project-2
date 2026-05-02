package com.project2.demo.DTO.Requests;

import java.util.List;

public record ClinicUpdateDTO(
    String name,
    String address,
    String phone,
    List<String> clinicImamges,
    String description
) {
    
}
