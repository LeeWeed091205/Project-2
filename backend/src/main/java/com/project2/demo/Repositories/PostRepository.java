package com.project2.demo.Repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project2.demo.Models.Post;

@Repository
public interface PostRepository extends JpaRepository<Post,Integer>{

    // Slice giống Page nhưng không đếm số phần tử, phục vụ cho scroll post
    // pagable giống như 1 obj đóng gói các thông tin pageNo (trang mấy), pageSize(bao nhiêu post 1 trang)
    Slice<Post> findAllByOrderByPostIdDesc(Pageable pagable);

    Slice<Post> findAllByUserUserIdOrderByPostIdDesc(Integer userId, Pageable pageable);
}
