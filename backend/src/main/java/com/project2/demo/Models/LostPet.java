package com.project2.demo.Models;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import com.project2.demo.Enums.PetStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LostPet{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer lostpetId;


    @Column(columnDefinition = "NVARCHAR(255)")
    private String petname;


    @Column(columnDefinition = "NVARCHAR(255)")
    private String species;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String breed;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;


    @Column(columnDefinition = "NVARCHAR(255)")
    private String location;

    
    private LocalDateTime lostdate;

    private String contact;

    @Enumerated(EnumType.STRING)
    private PetStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @OneToMany(mappedBy = "lostpet",cascade = CascadeType.ALL)
    private List<LostPetImage> lostpetImages;
}
