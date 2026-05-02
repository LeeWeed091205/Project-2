package com.project2.demo.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.project2.demo.DTO.Requests.ReviewCreateDTO;
import com.project2.demo.DTO.Requests.ReviewUpdateDTO;
import com.project2.demo.DTO.Responses.ReviewResponseDTO;
import com.project2.demo.Models.Review;


@Mapper(componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)

public interface ReviewMapper {
    
    @Mapping(target = "reviewId", ignore = true)
    Review toEntity(ReviewCreateDTO dto);

    @Mapping(target = "reviewId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateReview(ReviewUpdateDTO dto,@MappingTarget Review review);



   @Mapping(source = "user.username",target = "username")
   @Mapping(source = "user.avatarUrl",target = "avatarUrl")
   @Mapping(source = "clinic.name", target = "clinicname")
   ReviewResponseDTO toReviewResponseDTO(Review review);
   
   
}
