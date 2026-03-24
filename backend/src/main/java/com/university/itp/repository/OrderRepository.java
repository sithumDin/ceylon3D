package com.university.itp.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.university.itp.model.Product;
import com.university.itp.model.OrderEntity;
import com.university.itp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUser(User user);

    @Modifying
    @Query("UPDATE OrderItem o SET o.product = null WHERE o.product = :product")
    void nullifyProductInOrderItems(@Param("product") Product product);
}
