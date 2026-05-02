package com.project2.demo.Mapper;


import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.project2.demo.DTO.Requests.LostPetCreateDTO;
import com.project2.demo.DTO.Requests.LostPetUpdateDTO;
import com.project2.demo.DTO.Responses.LostPetDetailInfoDTO;
import com.project2.demo.DTO.Responses.LostPetInfoDTO;
import com.project2.demo.Models.LostPet;
import com.project2.demo.Models.LostPetImage;


@Mapper(componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LostPetMapper{
    
    @BeanMapping(qualifiedByName = "create")
    @Mapping(target = "lostpetId", ignore = true)
    @Mapping(target = "createdAt" , ignore = true)
    LostPet toEntity(LostPetCreateDTO dto);

    @Mapping(target = "lostpetId", ignore = true)
    @Mapping(target = "createdAt" , ignore = true)
    @Mapping(target = "lostpetImages", ignore = true)
    void updateLostPet(LostPetUpdateDTO dto, @MappingTarget LostPet lostpet);

    @Mapping(target = "userId", source = "user.userId")
    LostPetInfoDTO toLostPetInfoDTO(LostPet lostpet);

    @Mapping(target = "userId", source = "user.userId")
    LostPetDetailInfoDTO toLostPetDetailInfoDTO(LostPet lostpet);



    //Entity -> DTO
    default String mapString(LostPetImage lostpetImages){
        if (lostpetImages == null){
            return null;
        }else{
            return lostpetImages.getImgPetUrl();
        }
    }

    //DTO -> Entity
    default LostPetImage mapLostPetImage(String url){
        if (url == null){
            return null;
        }else{
            LostPetImage lostPetImage = new LostPetImage();
            lostPetImage.setImgPetUrl(url);
            return lostPetImage;
        }
    }

@Named("create")
    default void linkToLostPetImage(LostPet lostpet){
        if(lostpet.getLostpetImages() != null){
            lostpet.getLostpetImages().forEach(img -> img.setLostpet(lostpet));
        }
    }





}
