package com.project2.demo.Auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException; // Import cái này

import com.project2.demo.DTO.Requests.UserLoginDTO;
import com.project2.demo.DTO.Requests.UserRegisterDTO;
import com.project2.demo.DTO.Requests.UserUpdatePasswordDTO;
import com.project2.demo.DTO.Responses.LoginResponseDTO;
import com.project2.demo.Enums.Role;
import com.project2.demo.Mapper.UserMapper;
import com.project2.demo.Models.User;
import com.project2.demo.Repositories.UserRepository;

import lombok.AllArgsConstructor;



@Service
@AllArgsConstructor
public class AuthService {
    private final JWTService jWTService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;



    public void register(UserRegisterDTO dto){
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.password()));
        

        if (user.getUsername() == null || user.getPassword() == null) {
            // Dùng ResponseStatusException, truyền mã 400 (BAD_REQUEST)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username and password are required");
        }

        if (userRepository.findByUsername(user.getUsername()) != null || userRepository.findByEmail(user.getEmail()) != null){
            // Trùng lặp dữ liệu -> Báo lỗi 400 (hoặc 409 CONFLICT)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username or Email already existed");
        }

        
        user.setRole(Role.USER);
        userRepository.save(user);
    }

    public LoginResponseDTO login(UserLoginDTO dto){
        User loginUser = userRepository.findByUsername(dto.username());

        if (loginUser == null){
            // Sai tài khoản -> Báo lỗi 401 (UNAUTHORIZED)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai tên đăng nhập hoặc mật khẩu");
        }
        
        // So sánh password
        if(!passwordEncoder.matches(dto.password(), loginUser.getPassword())) {
            // Sai mật khẩu -> Báo lỗi 401 (UNAUTHORIZED)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai tên đăng nhập hoặc mật khẩu");
        }


        
        return new LoginResponseDTO(
            "Bearer " + jWTService.generateToken(loginUser), 
            loginUser.getUsername(), 
            loginUser.getAvatarUrl(),
            loginUser.getRole().name(), 
            loginUser.getUserId()
        );
    }


    public void updatePassword(UserUpdatePasswordDTO dto, Integer userId){
        User currentUser = userRepository.findById(userId).orElseThrow(()->new RuntimeException("Can not find user"));


        if(dto.oldpassword() == null || dto.newpassword() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Old password and New password are required");
        }


        if(!passwordEncoder.matches(dto.oldpassword(), currentUser.getPassword())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password is incorrect");
        }


        currentUser.setPassword(passwordEncoder.encode(dto.newpassword()));
        userRepository.save(currentUser);

    }
}