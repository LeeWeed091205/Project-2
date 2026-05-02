package com.project2.demo.Models;


import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Integer reviewId;

    private int rating;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String comment;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "clinicId")
    private Clinic clinic;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userId", nullable = false)
    private User user;




}
