package com.expense.tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expense.tracker.model.Expense;
import com.expense.tracker.model.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserOrderByDateDesc(User user);

    // 🔥 ADD THIS
    void deleteByUser(User user);
}