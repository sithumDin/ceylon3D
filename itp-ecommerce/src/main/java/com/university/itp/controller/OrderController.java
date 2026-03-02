package com.university.itp.controller;

import com.university.itp.model.OrderEntity;
import com.university.itp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> placeOrder(Authentication auth, @RequestBody OrderEntity req) {
        return orderService.placeOrder(auth.getName(), req);
    }

    @GetMapping
    public List<OrderEntity> myOrders(Authentication auth) {
        return orderService.myOrders(auth.getName());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public List<OrderEntity> allOrders() {
        return orderService.allOrders();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody OrderEntity req) {
        return orderService.updateStatus(id, req);
    }
}