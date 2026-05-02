package com.project2.demo.Services;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.project2.demo.Auth.SecurityUtil;
import com.project2.demo.DTO.Requests.ReviewCreateDTO;
import com.project2.demo.DTO.Requests.ReviewUpdateDTO;
import com.project2.demo.DTO.Responses.ReviewResponseDTO;
import com.project2.demo.Mapper.ReviewMapper;
import com.project2.demo.Models.Review;
import com.project2.demo.Repositories.ClinicRepository;
import com.project2.demo.Repositories.ReviewRepository;
import com.project2.demo.Repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    private final UserRepository userRepository;

    private final ReviewMapper reviewMapper;

    private final ClinicRepository clinicRepository;


    //  Móc nối các Entity liên kết (Dùng getReferenceById để tối ưu tốc độ)
    @Transactional
    public ReviewResponseDTO createReview(ReviewCreateDTO create_dto,Integer userId, Integer clinicId){
        Review new_review = reviewMapper.toEntity(create_dto);
        new_review.setUser(userRepository.getReferenceById(userId));
        new_review.setClinic(clinicRepository.getReferenceById(clinicId));
        reviewRepository.save(new_review);
        return reviewMapper.toReviewResponseDTO(new_review);
    }

    @Transactional
    public ReviewResponseDTO updateReview(ReviewUpdateDTO update_dto, Integer reviewId, Integer userId){
        Review update_review = reviewRepository.findById(reviewId).orElseThrow(()-> new RuntimeException("error finding this review"));

        if (!update_review.getUser().getUserId().equals(userId)){
            throw new RuntimeException("You can not change reviews that aren't yours");
        }
        reviewMapper.updateReview(update_dto, update_review);
        reviewRepository.save(update_review);
        return reviewMapper.toReviewResponseDTO(update_review);
    }


    @Transactional
    public void deleteReview(Integer reviewId, Integer userId){
        Review delete_review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("error finding the review"));

        if (!delete_review.getUser().getUserId().equals(userId) && !SecurityUtil.isAdmin()){
            throw new RuntimeException("You can not delete reviews that aren't yours");
        }

        reviewRepository.deleteById(reviewId);
    }


    public Slice<ReviewResponseDTO> getAllByClinicId(Integer clinicId, int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo,pageSize);

        Slice<Review> reviews = reviewRepository.findAllByClinic_ClinicIdOrderByReviewIdDesc(clinicId, pageable);

        return reviews.map(reviewMapper::toReviewResponseDTO);
    }

    
    public Slice<ReviewResponseDTO> getAllByRatingAndClinicId(int rating,Integer clinicId, int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo, pageSize);

        Slice<Review> reviews = reviewRepository.findAllByRatingAndClinic_ClinicIdOrderByReviewIdDesc(rating, clinicId, pageable);

        return reviews.map(reviewMapper::toReviewResponseDTO);
    }
}
