package com.project2.demo.Models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.project2.demo.Enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @NotEmpty(message = "the username must not be empty")
    @Column(nullable = false, unique = true, columnDefinition = "NVARCHAR(255)")
    private String username;

    @Column(nullable = false,unique = true, columnDefinition = "NVARCHAR(255)")
    private String email;

    @NotBlank(message = "Invalid password")
    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String password;


    @Column(columnDefinition = "NVARCHAR(255)")
    private String avatarUrl;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String bio;

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<Post> listPost = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LostPet> listLostPets = new ArrayList<>();


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> listReviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> listComments = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        //role là Enum nên mặc định có phương thức name() trả về tên Enum dưới dạng String
        return List.of(new SimpleGrantedAuthority(role.name())); // Dùng List.of để tạo một danh sách chứa phần tử duy nhất phân quyền người dùng 
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Mặc định true: Tài khoản không hết hạn
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Mặc định true: Tài khoản không bị khóa
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Mặc định true: Thông tin xác thực (mật khẩu) không hết hạn
    }

    @Override
    public boolean isEnabled() {
        return true; // Mặc định true: Tài khoản đang được kích hoạt
    }
}
