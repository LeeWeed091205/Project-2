package com.project2.demo.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.project2.demo.DTO.Requests.UserRegisterDTO;
import com.project2.demo.DTO.Requests.UserUpdateProfileDTO;
import com.project2.demo.DTO.Responses.UserInfoDTO;
import com.project2.demo.DTO.Responses.UserInfoDetailDTO;
import com.project2.demo.DTO.Responses.UserProfileResponseDTO;
import com.project2.demo.Models.User;

@Mapper(componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UserMapper {
    //Request
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    User toEntity(UserRegisterDTO dto);


    @Mapping(target = "userId", ignore = true)
    void updateUser(UserUpdateProfileDTO dto, @MappingTarget User user);



    //Response
    UserProfileResponseDTO toUserProfileResponseDTO(User user);

    UserInfoDTO toUserInfoDTO(User user);

    UserInfoDetailDTO toUserInfoDetailDTO(User user);


}
