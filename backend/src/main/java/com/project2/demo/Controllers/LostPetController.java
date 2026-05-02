package com.project2.demo.Controllers;

import org.springframework.web.bind.annotation.RestController;

import com.project2.demo.Auth.SecurityUtil;
import com.project2.demo.DTO.Requests.LostPetCreateDTO;
import com.project2.demo.DTO.Requests.LostPetUpdateDTO;
import com.project2.demo.DTO.Responses.LostPetDetailInfoDTO;
import com.project2.demo.DTO.Responses.LostPetInfoDTO;
import com.project2.demo.Services.LostPetService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;


import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;







@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lostpet")
public class LostPetController {
    private final LostPetService lostPetService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public void createLostPet(@RequestBody @Valid LostPetCreateDTO dto) {
        Integer currentUserId = SecurityUtil.getCurrentUserId();
        if (currentUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        lostPetService.createLostPet(dto, currentUserId);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public void updateLostPet(@PathVariable(name = "id") Integer lostpetId, @RequestBody @Valid LostPetUpdateDTO dto) {
        Integer currentUserId = SecurityUtil.getCurrentUserId();
        if (currentUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        
        
        lostPetService.updateLostPet(dto, lostpetId, currentUserId);
    }


    


    @GetMapping("/{id}")
    public LostPetDetailInfoDTO getLostODetailInfoDTO(@PathVariable(name = "id") Integer lostpetId) {
        return lostPetService.getLostPetDetailInfo(lostpetId);
    }

    @GetMapping
    public Slice<LostPetInfoDTO> getAllLostPet(@RequestParam int pageNo, @RequestParam int pageSize) {
        return lostPetService.getAllLostPet(pageNo, pageSize);
    }
    
    

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public void deleteLostPet(@PathVariable(name = "id") Integer lostpetId){
        Integer currentUserId = SecurityUtil.getCurrentUserId();
        
        lostPetService.deleteLostPet(lostpetId, currentUserId);
    }

    
    
}
