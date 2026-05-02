package com.project2.demo.Repositories;

import com.project2.demo.Models.User;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    User findByUsername(String username);

    User findByEmail(String email);

    Slice<User> findAllByOrderByUserIdDesc(Pageable pageable);
}
