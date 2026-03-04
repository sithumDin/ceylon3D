package com.university.itp.controller;

import com.university.itp.model.CartItem;
import com.university.itp.model.Product;
import com.university.itp.model.User;
import com.university.itp.repository.CartItemRepository;
import com.university.itp.repository.ProductRepository;
import com.university.itp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    @GetMapping
    public ResponseEntity<?> getCart(Authentication auth){
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        List<CartItem> items = cartItemRepository.findByUser(user);

        // Remove orphaned entries (product deleted or null)
        List<CartItem> orphaned = new java.util.ArrayList<>();
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (CartItem ci : items) {
            Product p = null;
            try {
                p = ci.getProduct();
                if (p != null) p.getId(); // force proxy init
            } catch (Exception e) {
                p = null;
            }
            if (p == null) {
                orphaned.add(ci);
                continue;
            }
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", ci.getId());
            entry.put("quantity", ci.getQuantity());
            Map<String, Object> prod = new HashMap<>();
            prod.put("id", p.getId());
            prod.put("name", p.getName());
            prod.put("price", p.getPrice());
            prod.put("imagePath", p.getImagePath());
            entry.put("product", prod);
            result.add(entry);
        }
        if (!orphaned.isEmpty()) {
            cartItemRepository.deleteAll(orphaned);
            cartItemRepository.flush();
        }
        return ResponseEntity.ok(result);
    }

    @Transactional
    @PostMapping
    public ResponseEntity<?> addToCart(Authentication auth, @RequestBody Map<String, Object> req){
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Long productId = ((Number) req.get("productId")).longValue();
        int quantity = req.containsKey("quantity") ? ((Number) req.get("quantity")).intValue() : 1;

        Product product = productRepository.findById(productId).orElseThrow();

        // Use a direct DB query instead of loading all items and filtering in Java
        var existing = cartItemRepository.findByUserAndProduct(user, product);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            CartItem saved = cartItemRepository.saveAndFlush(item);
            return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "productId", productId,
                "quantity", saved.getQuantity()
            ));
        }

        CartItem item = CartItem.builder().user(user).product(product).quantity(quantity).build();
        CartItem saved = cartItemRepository.saveAndFlush(item);
        return ResponseEntity.ok(Map.of(
            "id", saved.getId(),
            "productId", productId,
            "quantity", saved.getQuantity()
        ));
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> req, Authentication auth){
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        CartItem item = cartItemRepository.findById(id).orElse(null);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        if (!item.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Not your cart item"));
        }

        int quantity = ((Number) req.get("quantity")).intValue();
        item.setQuantity(quantity);
        cartItemRepository.saveAndFlush(item);
        Map<String, Object> body = new HashMap<>();
        body.put("id", item.getId());
        body.put("productId", item.getProduct() != null ? item.getProduct().getId() : null);
        body.put("quantity", item.getQuantity());
        return ResponseEntity.ok(body);
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id, Authentication auth){
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        CartItem item = cartItemRepository.findById(id).orElse(null);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        if (!item.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Not your cart item"));
        }

        cartItemRepository.delete(item);
        cartItemRepository.flush();
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @DeleteMapping
    public ResponseEntity<?> clearCart(Authentication auth){
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        cartItemRepository.deleteAllByUser(user);
        cartItemRepository.flush();
        return ResponseEntity.noContent().build();
    }
}