package com.university.itp.controller;

import com.university.itp.model.CartItem;
import com.university.itp.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(Authentication auth, @RequestBody CartItem req) {
        return ResponseEntity.ok(cartService.addToCart(auth.getName(), req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CartItem req, Authentication auth) {
        return cartService.update(id, req, auth.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id, Authentication auth) {
        return cartService.remove(id, auth.getName());
    }
}