package com.university.itp.controller;

import com.university.itp.model.CartItem;
import com.university.itp.model.Product;
import com.university.itp.model.User;
import com.university.itp.repository.CartItemRepository;
import com.university.itp.repository.ProductRepository;
import com.university.itp.repository.UserRepository;
import com.university.itp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication auth){
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(cartItemRepository.findByUser(user));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(Authentication auth, @RequestBody CartItem req){
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Product p = productRepository.findById(req.getProduct().getId()).orElseThrow();
        CartItem item = CartItem.builder().user(user).product(p).quantity(req.getQuantity()).build();
        cartItemRepository.save(item);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CartItem req, Authentication auth){
        return cartItemRepository.findById(id).map(item -> {
            item.setQuantity(req.getQuantity());
            cartItemRepository.save(item);
            return ResponseEntity.ok(item);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id, Authentication auth){
        return cartItemRepository.findById(id).map(item -> {
            cartItemRepository.delete(item);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}