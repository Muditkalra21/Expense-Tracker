package com.expensetracker.service;

import com.expensetracker.dto.UserCompanyDto;
import com.expensetracker.entity.UserCompany;
import com.expensetracker.repository.UserCompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserCompanyService {

    @Autowired
    private UserCompanyRepository userCompanyRepository;

    public List<UserCompanyDto> getUserCompaniesByUserId(Long userId) {
        return userCompanyRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserCompanyDto> getCompanyUsersByCompanyId(Long companyId) {
        return userCompanyRepository.findByCompanyId(companyId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private UserCompanyDto convertToDto(UserCompany userCompany) {
        UserCompanyDto dto = new UserCompanyDto();
        dto.setId(userCompany.getId());
        dto.setUserId(userCompany.getUser().getId());
        dto.setCompanyId(userCompany.getCompany().getId());
        dto.setRole(userCompany.getRole().toString());
        return dto;
    }
}