package com.university.itp.repository;

import com.university.itp.model.CartItem;
import com.university.itp.model.Product;
import com.university.itp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends MongoRepository<CartItem, String> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteAllByUser(User user);
    void deleteAllByProduct(Product product);
}
