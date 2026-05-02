package com.project2.demo.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException; // <-- Import thêm cái này

import java.io.IOException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bắt cái lỗi trùng lặp mà Service vừa ném ra
    @ExceptionHandler(DuplicateResourceException.class) 
    public ResponseEntity<String> handleDuplicateResource(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // Bắt lỗi Validation (ví dụ @NotBlank, @Size) từ DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // Bắt lỗi ResponseStatusException và trả về JSON
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        // ex.getStatusCode().value() sẽ lấy ra số 401, 400, 404...
        errorResponse.put("status", ex.getStatusCode().value());
        errorResponse.put("error", ex.getStatusCode());
        // ex.getReason() sẽ lấy ra đúng câu "Sai tên đăng nhập hoặc mật khẩu" của bạn
        errorResponse.put("message", ex.getReason()); 
        
        return ResponseEntity.status(ex.getStatusCode()).body(errorResponse);
    }





    // 1. Bắt lỗi trong quá trình upload (VD: đứt cáp, Cloudinary từ chối...)
    @ExceptionHandler(IOException.class)
    public ResponseEntity<Map<String, Object>> handleIOException(IOException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorResponse.put("error", "Lỗi xử lý file");
        errorResponse.put("message", "Quá trình tải file lên thất bại: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    // 2. RẤT QUAN TRỌNG: Bắt lỗi khi Frontend gửi file quá lớn (VD > 5MB như ta đã config)
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", HttpStatus.CONTENT_TOO_LARGE.value()); // Mã 413
        errorResponse.put("error", "Dung lượng file quá lớn");
        errorResponse.put("message", "Vui lòng chỉ upload file có kích thước dưới 5MB!");
        
        return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE).body(errorResponse);
    }

    // Bắt tất cả các lỗi hệ thống (NullPointerException, lỗi Database...) chưa lường trước được
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        // Nhớ in lỗi ra Console để anh em Dev còn biết đường fix nhé
        ex.printStackTrace(); 
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống, vui lòng thử lại sau!");
    }
}