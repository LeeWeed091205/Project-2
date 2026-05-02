package com.project2.demo.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project2.demo.Auth.SecurityUtil;
import com.project2.demo.DTO.Requests.UserUpdateProfileDTO;
import com.project2.demo.DTO.Responses.UserInfoDTO;
import com.project2.demo.DTO.Responses.UserInfoDetailDTO;
import com.project2.demo.Services.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;




    @PutMapping
    public String updateUserProfile(@RequestBody UserUpdateProfileDTO dto) {
        //TODO: process PUT request
        Integer currentUserId = SecurityUtil.getCurrentUserId();
        userService.userUpdateProfile(dto, currentUserId);
        
        return "Profile updated successfully";
    }


    @GetMapping("/all")
    public Slice<UserInfoDTO> getAllUserInfo(@RequestParam int pageNo, @RequestParam int pageSize) {
        return userService.getUserInfo(pageNo, pageSize);
    }

    @GetMapping("/my-info")
    public UserInfoDetailDTO getMyInfoDetail() {
        Integer currentUserId = SecurityUtil.getCurrentUserId();
        return userService.getMyInfoDetail(currentUserId);
    }

    @GetMapping("/{id}")
    public UserInfoDetailDTO getUserInfoDetailDTO(@PathVariable Integer userId) {
        return userService.getOtherUserInfoDetail(userId);
    }
    
    
    

}
