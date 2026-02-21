package com.expense.tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expense.tracker.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    User findByEmail(String email);
}