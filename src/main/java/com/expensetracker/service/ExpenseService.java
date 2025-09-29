package com.expensetracker.service;

import com.expensetracker.dto.ExpenseDto;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.entity.UserCompany;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserCompanyRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCompanyRepository userCompanyRepository;

    public ExpenseDto createExpense(ExpenseDto expenseDto, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserCompany userCompany = userCompanyRepository.findByUserId(user.getId()).stream().findFirst().orElseThrow(() -> new RuntimeException("User not associated with any company"));

        Expense expense = new Expense();
        expense.setDescription(expenseDto.getDescription());
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setDate(expenseDto.getDate());
        expense.setUser(user);
        expense.setCompany(userCompany.getCompany());
        expense.setCreatedAt(LocalDateTime.now());
        expense = expenseRepository.save(expense);
        return convertToDto(expense);
    }

    public ExpenseDto getExpenseById(Long id, String username) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }
        return convertToDto(expense);
    }

    public List<ExpenseDto> getExpensesByUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return expenseRepository.findByUserId(user.getId()).stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<ExpenseDto> getExpensesByCompany(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserCompany userCompany = userCompanyRepository.findByUserId(user.getId()).stream().findFirst().orElseThrow(() -> new RuntimeException("User not associated with any company"));
        return expenseRepository.findByCompanyId(userCompany.getCompany().getId()).stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ExpenseDto updateExpense(Long id, ExpenseDto expenseDto, String username) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }
        expense.setDescription(expenseDto.getDescription());
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setDate(expenseDto.getDate());
        expense = expenseRepository.save(expense);
        return convertToDto(expense);
    }

    public void deleteExpense(Long id, String username) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }
        expenseRepository.deleteById(id);
    }

    private ExpenseDto convertToDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setDate(expense.getDate());
        dto.setUserId(expense.getUser().getId());
        dto.setCompanyId(expense.getCompany().getId());
        return dto;
    }
}
