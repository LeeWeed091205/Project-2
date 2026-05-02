package com.project2.demo.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project2.demo.DTO.Requests.ClinicCreateDTO;
import com.project2.demo.DTO.Requests.ClinicUpdateDTO;
import com.project2.demo.DTO.Responses.ClinicDetailInfoDTO;
import com.project2.demo.DTO.Responses.ClinicInfoDTO;
import com.project2.demo.Services.ClinicService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Slice;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequiredArgsConstructor
@RequestMapping("/api/clinic")
public class ClinicController {
    private final ClinicService clinicService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void createClinic(@RequestBody @Valid ClinicCreateDTO dto) {
        clinicService.createClinic(dto);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void updateClinic(@PathVariable(name = "id") Integer clinicId, @RequestBody @Valid ClinicUpdateDTO dto) {
        clinicService.updateClinicInfor(dto, clinicId);
    }


    @GetMapping("/{id}")
    public ClinicDetailInfoDTO getClinicDetailInfo(@PathVariable(name = "id") Integer clinicId) {
        return clinicService.getClinicDetailInforById(clinicId);
    }
    
    

    @GetMapping
    public Slice<ClinicInfoDTO> getAllClinic(@RequestParam int pageNo, @RequestParam int pageSize) {
        return clinicService.getAllClinic(pageNo,pageSize);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void deleteClinic(@PathVariable(name = "id") Integer clinicId){
        clinicService.deleteClinic(clinicId);
    }

    
}
