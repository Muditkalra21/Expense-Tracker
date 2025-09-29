package com.expensetracker.repository;

import com.expensetracker.entity.UserCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCompanyRepository extends JpaRepository<UserCompany, Long> {
    List<UserCompany> findByUserId(Long userId);
    List<UserCompany> findByCompanyId(Long companyId);
    Optional<UserCompany> findByUserIdAndCompanyId(Long userId, Long companyId);
}
