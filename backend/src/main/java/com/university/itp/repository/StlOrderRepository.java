package com.university.itp.repository;

import com.university.itp.model.StlOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StlOrderRepository extends JpaRepository<StlOrder, Long> {
    List<StlOrder> findAllByOrderByCreatedAtDesc();
}
