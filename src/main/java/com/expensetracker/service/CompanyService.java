// package com.expensetracker.service;

// import com.expensetracker.dto.CompanyDto;
// import com.expensetracker.entity.Company;
// import com.expensetracker.repository.CompanyRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class CompanyService {

//     @Autowired
//     private CompanyRepository companyRepository;

//     public CompanyDto createCompany(CompanyDto companyDto) {
//         Company company = new Company();
//         company.setName(companyDto.getName());
//         company = companyRepository.save(company);
//         return convertToDto(company);
//     }

//     public CompanyDto getCompanyById(Long id) {
//         Company company = companyRepository.findById(id).orElseThrow(() -> new RuntimeException("Company not found"));
//         return convertToDto(company);
//     }

//     public List<CompanyDto> getAllCompanies() {
//         return companyRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
//     }

//     public CompanyDto updateCompany(Long id, CompanyDto companyDto) {
//         Company company = companyRepository.findById(id).orElseThrow(() -> new RuntimeException("Company not found"));
//         company.setName(companyDto.getName());
//         company = companyRepository.save(company);
//         return convertToDto(company);
//     }

//     public void deleteCompany(Long id) {
//         companyRepository.deleteById(id);
//     }

//     private CompanyDto convertToDto(Company company) {
//         CompanyDto dto = new CompanyDto();
//         dto.setId(company.getId());
//         dto.setName(company.getName());
//         return dto;
//     }
// }

package com.expensetracker.service;

import com.expensetracker.dto.CompanyDto;
import com.expensetracker.entity.Company;
import com.expensetracker.entity.User;
import com.expensetracker.entity.UserCompany;
import com.expensetracker.repository.CompanyRepository;
import com.expensetracker.repository.UserCompanyRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCompanyRepository userCompanyRepository;

    public CompanyDto createCompany(CompanyDto companyDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = new Company();
        company.setName(companyDto.getName());
        company.setAddress(companyDto.getAddress());
        company.setOwner(owner);
        company.setCreatedAt(LocalDateTime.now());
        company = companyRepository.save(company);

        // Create UserCompany relationship with OWNER role
        UserCompany userCompany = new UserCompany();
        userCompany.setUser(owner);
        userCompany.setCompany(company);
        userCompany.setRole(UserCompany.Role.OWNER);
        userCompany.setJoinedAt(LocalDateTime.now());
        userCompanyRepository.save(userCompany);

        return convertToDto(company);
    }

    public List<CompanyDto> getAllCompanies() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only return companies the user is associated with
        List<UserCompany> userCompanies = userCompanyRepository.findByUserId(user.getId());
        return userCompanies.stream()
                .map(uc -> convertToDto(uc.getCompany()))
                .collect(Collectors.toList());
    }

    public CompanyDto getCompanyById(Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Verify user has access to this company
        userCompanyRepository.findByUserIdAndCompanyId(user.getId(), company.getId())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        return convertToDto(company);
    }

    public CompanyDto updateCompany(Long id, CompanyDto companyDto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setName(companyDto.getName());
        company.setAddress(companyDto.getAddress());
        company = companyRepository.save(company);
        return convertToDto(company);
    }

    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }

    private CompanyDto convertToDto(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setAddress(company.getAddress());
        return dto;
    }
}