package com.university.itp.repository;

import com.university.itp.model.CartItem;
import com.university.itp.model.Product;
import com.university.itp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteAllByUser(User user);
}
