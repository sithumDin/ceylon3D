package com.university.itp.repository;

import com.university.itp.model.StlOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StlOrderRepository extends JpaRepository<StlOrder, Long> {
    List<StlOrder> findAllByOrderByCreatedAtDesc();
    List<StlOrder> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    /** Find STL orders that belong to a user — by userId OR by matching email (case-insensitive) */
    @Query("SELECT o FROM StlOrder o WHERE o.userId = :userId OR LOWER(o.customerEmail) = LOWER(:email) ORDER BY o.createdAt DESC")
    List<StlOrder> findByUserIdOrEmail(@Param("userId") Long userId, @Param("email") String email);
}
