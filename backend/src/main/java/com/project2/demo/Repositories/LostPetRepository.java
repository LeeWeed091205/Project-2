package com.project2.demo.Repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project2.demo.Models.LostPet;

@Repository
public interface LostPetRepository extends JpaRepository<LostPet,Integer>{
    Slice<LostPet> findAllByOrderByLostpetIdDesc(Pageable pageable);
}
