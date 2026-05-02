package com.project2.demo.Auth;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;



@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true) // Dòng này để mở PreAuthorized cho các API
public class SecurityConfig{
   private final JWTAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public SecurityFilterChain configure(HttpSecurity http)  throws Exception{
        http
            //Tắt csrf vì làm JWT
            .csrf(customizer->customizer.disable())
            .cors(Customizer.withDefaults())
            //Cấu hình Sesion thành Stateless
            .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            //Phân quyền các endpoint
            .authorizeHttpRequests(auth->auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                .anyRequest().authenticated()
            );

            // Chỗ này thêm JWTAuthenticationFilter vào trước Chain filter này
            http.addFilterBefore(jwtAuthenticationFilter,UsernamePasswordAuthenticationFilter.class);
            
            return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    // Cái này sẽ tự làm hộ bước check login, trong bài này, đã dùng cơm code hàm login riêng trong 
    //AuthService rồi nên bác "bảo vệ" AuthenticationManager này không còn cần thiết nữa
    // @Bean
    // AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
    //     return config.getAuthenticationManager();
    // }


 
    
}
