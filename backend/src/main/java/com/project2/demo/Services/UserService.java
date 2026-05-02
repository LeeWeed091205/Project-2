package com.project2.demo.Services;

import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.project2.demo.DTO.Requests.UserUpdateProfileDTO;
import com.project2.demo.DTO.Responses.UserInfoDTO;
import com.project2.demo.DTO.Responses.UserInfoDetailDTO;
import com.project2.demo.DTO.Responses.UserProfileResponseDTO;
import com.project2.demo.Mapper.UserMapper;
import com.project2.demo.Models.User;
import com.project2.demo.Repositories.UserRepository;

import lombok.AllArgsConstructor;
import lombok.Builder;

@Service
@AllArgsConstructor
@Builder
public class UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;







    public UserUpdateProfileDTO userUpdateProfile(UserUpdateProfileDTO dto, Integer userId){
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        userMapper.updateUser(dto, user);

        userRepository.save(user);
        return dto;

    }


    public UserProfileResponseDTO getUserById(Integer userId){
        return userMapper.toUserProfileResponseDTO(userRepository.findById(userId).orElseThrow(()->new RuntimeException("No user with that id found")));
    }

    public Slice<UserInfoDTO> getUserInfo(int pageNo, int pageSize){
        Pageable pageable = PageRequest.of(pageNo,pageSize);

        Slice<User> listUser =  userRepository.findAllByOrderByUserIdDesc(pageable);

        return listUser.map(userMapper::toUserInfoDTO);


    }

    public UserInfoDetailDTO getOtherUserInfoDetail(Integer userId){
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Can not get this user info"));

        return userMapper.toUserInfoDetailDTO(user);
    }

    public UserInfoDetailDTO getMyInfoDetail(Integer userId){
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Can not get your Infor"));

      
        return userMapper.toUserInfoDetailDTO(user);
    }


   


}
