package com.project2.demo.Repositories;


import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project2.demo.Models.Review;

    public interface ReviewRepository extends JpaRepository<Review,Integer> {
        //Tuy nhiên việc cài đặt sắp xếp trong service được khuyên dùng hơn do tính linh hoạt khi thay đổi
        //Ở đây, ta vẫn dùng cách sort từ trong Repo
        Slice<Review> findAllByClinic_ClinicIdOrderByReviewIdDesc(Integer clinicId, Pageable pageable);

        Slice<Review> findAllByRatingAndClinic_ClinicIdOrderByReviewIdDesc(int rating, Integer clinicId,Pageable pageable);

    }
