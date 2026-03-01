package com.university.itp.controller;

import com.university.itp.dto.OrderStatusUpdateRequest;
import com.university.itp.model.*;
import com.university.itp.repository.CartItemRepository;
import com.university.itp.repository.OrderRepository;
import com.university.itp.repository.ProductRepository;
import com.university.itp.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Set<String> ALLOWED_STATUSES = Set.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> placeOrder(Authentication auth, @RequestBody OrderEntity req){
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        List<CartItem> cart = cartItemRepository.findByUser(user);
        if(cart.isEmpty()) return ResponseEntity.badRequest().body("Cart is empty");

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setShippingAddress(req.getShippingAddress());

        List<OrderItem> items = cart.stream().map(ci -> {
            OrderItem oi = new OrderItem();
            oi.setProduct(ci.getProduct());
            oi.setQuantity(ci.getQuantity());
            oi.setUnitPrice(ci.getProduct().getPrice());
            oi.setOrder(order);
            return oi;
        }).collect(Collectors.toList());

        order.setItems(items);
        BigDecimal total = items.stream().map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        OrderEntity saved = orderRepository.save(order);
        cartItemRepository.deleteAll(cart);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<OrderEntity> myOrders(Authentication auth){
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return orderRepository.findByUser(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public List<OrderEntity> allOrders(){
        return orderRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequest req){
        String normalized = req.getStatus().trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(normalized)) {
            return ResponseEntity.badRequest().body("Invalid order status");
        }

        return orderRepository.findById(id).map(o -> {
            o.setStatus(normalized);
            orderRepository.save(o);
            return ResponseEntity.ok(o);
        }).orElse(ResponseEntity.notFound().build());
    }
}