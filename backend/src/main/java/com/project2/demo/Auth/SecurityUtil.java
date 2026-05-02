package com.project2.demo.Auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.project2.demo.Models.User;

/**
 * Utility class để lấy thông tin người dùng hiện tại từ Spring Security Context
 */
@Component
public class SecurityUtil {
    
    /**
     * Lấy User hiện tại từ Security Context
     * @return User object
     */
    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        return null;
    }
    
    /**
     * Lấy userId của người dùng hiện tại
     * @return Integer userId
     */
    public static Integer getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getUserId() : null;
    }
    
    /**
     * Kiểm tra xem người dùng hiện tại có phải là ADMIN không
     * @return boolean
     */
    public static boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && 
               authentication.getAuthorities().stream()
                   .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
    }
    
    /**
     * Kiểm tra xem userId có thuộc về người dùng hiện tại hoặc người dùng là ADMIN
     * @param userId ID cần kiểm tra
     * @return boolean
     */
    public static boolean isOwnerOrAdmin(Integer userId) {
        Integer currentUserId = getCurrentUserId();
        return isAdmin() || (currentUserId != null && currentUserId.equals(userId));
    }
}
