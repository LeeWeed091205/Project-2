package com.project2.demo.Models;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.project2.demo.Enums.PostCategory;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String title;
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @OneToMany(mappedBy = "post", cascade =  CascadeType.ALL,orphanRemoval = true)
    private List<PostImage> postImages = new ArrayList<>();

    
    @OneToMany(mappedBy = "post", cascade =  CascadeType.ALL,orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>() ;

    @ElementCollection(targetClass = PostCategory.class)//Báo cho JPA biết rằng field này (biến categories) là một bộ sưu tập (Collection) chứa các giá trị đơn giản, không phải là một Entity độc lập.
    @CollectionTable(name = "posts_categories", joinColumns = @JoinColumn(name = "post_id"))
    @Enumerated(EnumType.STRING) //Tác dụng cốt lõi: Quyết định cách mà giá trị Enum được lưu xuống Database.
    // @ManyToMany
    // @JoinTable(
    //     name = "posts_catagories",
    //     joinColumns = @JoinColumn(name = "postId"),
    //     inverseJoinColumns = @JoinColumn(name = "catagoriesId")
    // )
    private Set<PostCategory> categories = new HashSet<>();


    




 
}
