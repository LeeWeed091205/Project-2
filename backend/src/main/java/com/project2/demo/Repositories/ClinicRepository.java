package com.project2.demo.Repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project2.demo.Models.Clinic;

@Repository
public interface ClinicRepository extends JpaRepository<Clinic,Integer>{

    Slice<Clinic> findAllByOrderByClinicIdDesc(Pageable pageable);
}
