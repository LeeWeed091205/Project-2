package com.project2.demo.Mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.project2.demo.DTO.Requests.ClinicCreateDTO;
import com.project2.demo.DTO.Requests.ClinicUpdateDTO;
import com.project2.demo.DTO.Responses.ClinicDetailInfoDTO;
import com.project2.demo.DTO.Responses.ClinicInfoDTO;
import com.project2.demo.DTO.Responses.ReviewResponseDTO;
import com.project2.demo.Models.Clinic;
import com.project2.demo.Models.ClinicImage;
import com.project2.demo.Models.Review;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ClinicMapper {
    @BeanMapping(qualifiedByName = "create")
    @Mapping(target = "clinicId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "clinicImages", ignore = true)
    Clinic toEntity(ClinicCreateDTO dto);


    ClinicInfoDTO toClinicInfoDTO(Clinic clinic);


    ClinicDetailInfoDTO toClinicDetailInfoDTO(Clinic clinic);

    @Mapping(target = "clinicId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "clinicImages", ignore = true)
    void updateClinicInfo(ClinicUpdateDTO dto, @MappingTarget Clinic clinic);


    // Dạy mapStruct  cách map từ Entity sang 1 trường DTO khác(review của clinic)
   @Mapping(source = "user.username",target = "username")
   @Mapping(source = "user.avatarUrl",target = "avatarUrl")
   @Mapping(source = "clinic.name", target = "clinicname")
   ReviewResponseDTO toReviewResponseDTO(Review review);


    //DTO->Entity
    default ClinicImage mapClinicImage(String url){
        if (url == null){
            return null;
        }else{
            ClinicImage clinicImage = new ClinicImage();
            clinicImage.setImageUrl(url);
            return clinicImage;
        }
    }



    @Named("create")
    @AfterMapping
    default void linkToClinicImages(Clinic clinic){
        if(clinic.getClinicImages() != null){
            clinic.getClinicImages().forEach(clinicImg->clinicImg.setClinic(clinic));
        }
    }


    
    //Entity -> DTO
    default String mapString(ClinicImage clinicImage) {
        if (clinicImage == null) {
            return null;
        } else {
            return clinicImage.getImageUrl();
        }
    }




}
