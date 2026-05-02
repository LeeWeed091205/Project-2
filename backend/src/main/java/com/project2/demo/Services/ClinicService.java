package com.project2.demo.Services;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.project2.demo.DTO.Requests.ClinicCreateDTO;
import com.project2.demo.DTO.Requests.ClinicUpdateDTO;
import com.project2.demo.DTO.Responses.ClinicDetailInfoDTO;
import com.project2.demo.DTO.Responses.ClinicInfoDTO;
import com.project2.demo.DTO.Responses.ReviewResponseDTO;
import com.project2.demo.Mapper.ClinicMapper;
import com.project2.demo.Mapper.ReviewMapper;
import com.project2.demo.Models.Clinic;
import com.project2.demo.Models.ClinicImage;
import com.project2.demo.Models.Review;
import com.project2.demo.Repositories.ClinicRepository;
import com.project2.demo.Repositories.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ClinicService {
    
    private final ClinicRepository clinicRepository;

    private final ReviewRepository reviewRepository;

    private final ClinicMapper clinicMapper;

    private final ReviewMapper reviewMapper;

    



    //Admin
    @Transactional
    public void createClinic(ClinicCreateDTO dto){
        Clinic create_clinic = clinicMapper.toEntity(dto);
        clinicRepository.save(create_clinic);
    }


    @Transactional
    public void updateClinicInfor(ClinicUpdateDTO dto, Integer clinicId){
        Clinic update_clinic = clinicRepository.findById(clinicId).orElseThrow(()->new RuntimeException("Can not find the clinic"));
        //update clinic images
        if(dto.clinicImamges() != null){
            List<ClinicImage> clinicImages = dto.clinicImamges().stream().map(url -> {
                ClinicImage clinicImage = new ClinicImage();
                clinicImage.setImageUrl(url);
                clinicImage.setClinic(update_clinic);
                return clinicImage;
            }).toList();

            update_clinic.getClinicImages().clear();
            update_clinic.getClinicImages().addAll(clinicImages);
        
        }
        //update thông tin cơ bản
        clinicMapper.updateClinicInfo(dto,update_clinic);
        clinicRepository.save(update_clinic);
    }


    @Transactional
    public void deleteClinic(Integer clinicId){
        clinicRepository.deleteById(clinicId);
    }


    public ClinicInfoDTO getClinicInforById(Integer clinicId){
        Clinic clinic = clinicRepository.findById(clinicId).orElseThrow(()-> new RuntimeException("Can not find clinic"));
        return clinicMapper.toClinicInfoDTO(clinic);

    }


    public ClinicDetailInfoDTO getClinicDetailInforById(Integer clinicId){
        Clinic clinic = clinicRepository.findById(clinicId).orElseThrow(()-> new RuntimeException("Can not find clinic"));
        return clinicMapper.toClinicDetailInfoDTO(clinic);
    }

    

    public Slice<ClinicInfoDTO> getAllClinic(int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo,pageSize);

        Slice<Clinic> clinics = clinicRepository.findAllByOrderByClinicIdDesc(pageable);

        return clinics.map(clinicMapper::toClinicInfoDTO);
    }



    public Slice<ReviewResponseDTO> getClinicReview(Integer clinicId, int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo,pageSize);

        Slice<Review> reviews = reviewRepository.findAllByClinic_ClinicIdOrderByReviewIdDesc(clinicId, pageable);

        return reviews.map(reviewMapper::toReviewResponseDTO);

    }


    public Slice<ReviewResponseDTO> getClinicReviewByRating(Integer clinicId, int rating, int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Slice<Review> reviews = reviewRepository.findAllByRatingAndClinic_ClinicIdOrderByReviewIdDesc(rating, clinicId, pageable);

        return reviews.map(reviewMapper::toReviewResponseDTO);
    
    }
    



}
