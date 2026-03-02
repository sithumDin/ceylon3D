package com.university.itp.service;

import com.university.itp.model.CartItem;
import com.university.itp.model.Product;
import com.university.itp.model.User;
import com.university.itp.repository.CartItemRepository;
import com.university.itp.repository.ProductRepository;
import com.university.itp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItem> getCart(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(String email, CartItem req) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Product p = productRepository.findById(req.getProduct().getId()).orElseThrow();
        CartItem item = CartItem.builder()
                .user(user)
                .product(p)
                .quantity(req.getQuantity())
                .build();
        return cartItemRepository.save(item);
    }

    public ResponseEntity<?> update(Long id, CartItem req, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return cartItemRepository.findById(id).map(item -> {
            if (!item.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            item.setQuantity(req.getQuantity());
            cartItemRepository.save(item);
            return ResponseEntity.ok(item);
        }).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<?> remove(Long id, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return cartItemRepository.findById(id).map(item -> {
            if (!item.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            cartItemRepository.delete(item);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
