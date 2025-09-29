// package com.expensetracker.repository;

// import com.expensetracker.entity.Expense;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import java.time.LocalDate;
// import java.util.List;

// @Repository
// public interface ExpenseRepository extends JpaRepository<Expense, Long> {
//     List<Expense> findByUserId(Long userId);
//     List<Expense> findByCompanyId(Long companyId);
//     List<Expense> findByUserIdAndCompanyId(Long userId, Long companyId);

//     @Query("SELECT e FROM Expense e WHERE e.userId = :userId AND e.date BETWEEN :startDate AND :endDate")
//     List<Expense> findByUserIdAndDateRange(@Param("userId") Long userId,
//                                            @Param("startDate") LocalDate startDate,
//                                            @Param("endDate") LocalDate endDate);

//     @Query("SELECT e FROM Expense e WHERE e.companyId = :companyId AND e.date BETWEEN :startDate AND :endDate")
//     List<Expense> findByCompanyIdAndDateRange(@Param("companyId") Long companyId,
//                                               @Param("startDate") LocalDate startDate,
//                                               @Param("endDate") LocalDate endDate);
// }

package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
    List<Expense> findByCompanyId(Long companyId);
    
    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND e.company.id = :companyId")
    List<Expense> findByUserIdAndCompanyId(@Param("userId") Long userId, @Param("companyId") Long companyId);

    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND e.date BETWEEN :startDate AND :endDate")
    List<Expense> findByUserIdAndDateRange(@Param("userId") Long userId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    @Query("SELECT e FROM Expense e WHERE e.company.id = :companyId AND e.date BETWEEN :startDate AND :endDate")
    List<Expense> findByCompanyIdAndDateRange(@Param("companyId") Long companyId,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);
}