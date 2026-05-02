package com.project2.demo.Repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project2.demo.Models.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Integer>{
    Slice<Comment> findByPost_PostIdOrderByCommentIdDesc(Integer postId, Pageable pageable);
    
} 