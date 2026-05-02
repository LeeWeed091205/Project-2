package com.project2.demo.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project2.demo.Auth.SecurityUtil;
import com.project2.demo.DTO.Requests.ReviewCreateDTO;
import com.project2.demo.DTO.Requests.ReviewUpdateDTO;
import com.project2.demo.DTO.Responses.ReviewResponseDTO;
import com.project2.demo.Services.ReviewService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.data.domain.Slice;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


import lombok.RequiredArgsConstructor;







@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public ReviewResponseDTO createReview(@RequestBody @Valid ReviewCreateDTO dto, @RequestParam Integer clinicId) {
        Integer currentUserId = SecurityUtil.getCurrentUserId();

        return reviewService.createReview(dto,currentUserId, clinicId);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public ReviewResponseDTO updateReview(@PathVariable(name = "id") Integer reviewId, @RequestBody @Valid ReviewUpdateDTO dto) {
        Integer currentUserId = SecurityUtil.getCurrentUserId();

        

        return reviewService.updateReview(dto, reviewId, currentUserId);
    }


    @GetMapping
    public Slice<ReviewResponseDTO> getAllReviewByClinicId(@RequestParam Integer clinicId, @RequestParam int pageNo, @RequestParam int pageSize) {
        return reviewService.getAllByClinicId(clinicId, pageNo, pageSize);
    }

    @GetMapping("/rating")
    public Slice<ReviewResponseDTO> getReviewByRatingAndClinicId(@RequestParam Integer clinicId,@RequestParam int rating, @RequestParam int pageNo, @RequestParam int pageSize) {
        return reviewService.getAllByRatingAndClinicId(rating, clinicId, pageNo, pageSize);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public void deleteReview(@PathVariable(name = "id") Integer reviewId){
        Integer currentUserId = SecurityUtil.getCurrentUserId();

        
        reviewService.deleteReview(reviewId, currentUserId);
    }
    
    
    
}
