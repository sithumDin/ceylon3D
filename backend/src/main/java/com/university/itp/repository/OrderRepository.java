package com.university.itp.repository;

import com.university.itp.model.OrderEntity;
import com.university.itp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    List<OrderEntity> findByUser(User user);
}
