package com.project2.demo.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Vấn đề : chính sách CORS chỉ cho phép gọi tài nguyên tới cùng : Giao thức, tên miền, cổng. 
// file này đóng vai trò cononfig cho phép gọi api từ phía FE port 3000 đến 8080 ở BE
// Chúng ta cũng có thể dùng annot @CrossOrigin("*") với từng file Controller nhưng sẽ mất thời gian
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Dấu /** nghĩa là áp dụng CORS cho TẤT CẢ các đường dẫn API (/api/posts, /api/files, v.v.)
                .allowedOriginPatterns(
                    "http://localhost:*",
                    "http://127.0.0.1:*"
                ) // Cho phép frontend chạy trên các cổng dev khác nhau như 5177, 5175, 3000.
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Cho phép các HTTP methods này
                .allowedHeaders("*") // Cho phép tất cả các loại header
                .allowCredentials(true) // Rất quan trọng nếu sau này bạn dùng Cookie, Session hoặc Token (JWT) để đăng nhập
                .maxAge(3600); // Thời gian cache lại cấu hình này (giảm tải cho server)
    }
}