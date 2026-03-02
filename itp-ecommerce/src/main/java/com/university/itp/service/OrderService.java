package com.university.itp.service;

import com.university.itp.model.*;
import com.university.itp.repository.CartItemRepository;
import com.university.itp.repository.OrderRepository;
import com.university.itp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public ResponseEntity<?> placeOrder(String email, OrderEntity req) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<CartItem> cart = cartItemRepository.findByUser(user);
        if (cart.isEmpty())
            return ResponseEntity.badRequest().body("Cart is empty");

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
        BigDecimal total = items.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        OrderEntity saved = orderRepository.save(order);
        cartItemRepository.deleteAll(cart);
        return ResponseEntity.ok(saved);
    }

    public List<OrderEntity> myOrders(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return orderRepository.findByUser(user);
    }

    public List<OrderEntity> allOrders() {
        return orderRepository.findAll();
    }

    public ResponseEntity<?> updateStatus(Long id, OrderEntity req) {
        return orderRepository.findById(id).map(o -> {
            o.setStatus(req.getStatus());
            orderRepository.save(o);
            return ResponseEntity.ok(o);
        }).orElse(ResponseEntity.notFound().build());
    }
}
