package com.university.itp.controller;

import com.university.itp.dto.PlaceOrderRequest;
import com.university.itp.model.*;
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
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> placeOrder(Authentication auth, @Valid @RequestBody PlaceOrderRequest req){
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();

        if (req.getItems() == null || req.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty");
        }

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setCategory(OrderCategory.SHOP);
        order.setStatus("PENDING");
        order.setShippingAddress(req.getShippingAddress());

        List<OrderItem> items = req.getItems().stream().map(dto -> {
            OrderItem oi = new OrderItem();
            oi.setProductName(dto.getProductName());
            oi.setQuantity(dto.getQuantity());
            oi.setUnitPrice(dto.getUnitPrice());
            oi.setOrder(order);
            // Link to a real product if an ID was provided
            if (dto.getProductId() != null) {
                productRepository.findById(dto.getProductId()).ifPresent(oi::setProduct);
            }
            return oi;
        }).collect(Collectors.toList());

        order.setItems(items);
        BigDecimal total = items.stream()
            .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        OrderEntity saved = orderRepository.save(order);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<OrderEntity> myOrders(Authentication auth){
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return orderRepository.findByUser(user);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public List<OrderEntity> allOrders(){
        return orderRepository.findAll();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody OrderEntity req){
        return orderRepository.findById(id).map(o -> {
            o.setStatus(req.getStatus());
            orderRepository.save(o);
            return ResponseEntity.ok(o);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{id}/tracking")
    public ResponseEntity<?> updateTrackingNumber(@PathVariable Long id, @RequestBody java.util.Map<String, String> req) {
        return orderRepository.findById(id).map(o -> {
            o.setTrackingNumber(req.get("trackingNumber"));
            orderRepository.save(o);
            return ResponseEntity.ok(o);
        }).orElse(ResponseEntity.notFound().build());
    }
}