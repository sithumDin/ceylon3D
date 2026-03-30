package com.university.itp.repository;

import com.university.itp.model.StlOrder;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StlOrderRepository extends MongoRepository<StlOrder, String> {
    List<StlOrder> findAllByOrderByCreatedAtDesc();
    List<StlOrder> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    /** Find STL orders that belong to a user — by userId OR by matching email (case-insensitive) */
    List<StlOrder> findByUserIdOrCustomerEmailIgnoreCaseOrderByCreatedAtDesc(String userId, String email);
}
