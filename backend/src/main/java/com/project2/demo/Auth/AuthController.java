package com.project2.demo.Auth;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project2.demo.DTO.Requests.UserLoginDTO;
import com.project2.demo.DTO.Requests.UserRegisterDTO;
import com.project2.demo.DTO.Requests.UserUpdatePasswordDTO;
import com.project2.demo.DTO.Responses.LoginResponseDTO;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    
    private final AuthService authService;
    
    @PostMapping("/register")
    public String authRegister(@RequestBody @Valid UserRegisterDTO dto) {
        //TODO: process POST request
        authService.register(dto);
        ;

        
        return "Registerd successfully";
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authLogin(@RequestBody UserLoginDTO dto) {
        // 1. Gọi service xử lý login
        // Giả sử authService.login bây giờ trả về một Object chứa thông tin user sau khi check pass xong
        LoginResponseDTO response = authService.login(dto); 
        
        return ResponseEntity.ok(response);
    }


    @PostMapping("/update-password")
    public String updatePassword(@RequestBody @Valid UserUpdatePasswordDTO dto){
        Integer userId = SecurityUtil.getCurrentUserId();
        authService.updatePassword(dto, userId);

        return "Password updated successfully";

    }


    
    
    
}
