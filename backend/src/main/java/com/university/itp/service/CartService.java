package com.university.itp.service;

import com.university.itp.dto.CartItemDTO;
import com.university.itp.mapper.CartItemMapper;
import com.university.itp.model.CartItem;
import com.university.itp.model.Product;
import com.university.itp.model.User;
import com.university.itp.repository.CartItemRepository;
import com.university.itp.repository.ProductRepository;
import com.university.itp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemMapper cartItemMapper;

    public List<CartItemDTO> getCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        List<CartItem> items = cartItemRepository.findByUser(user);
        List<CartItem> orphaned = new ArrayList<>();
        List<CartItemDTO> result = new ArrayList<>();

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
            result.add(cartItemMapper.toDTO(ci));
        }

        if (!orphaned.isEmpty()) {
            cartItemRepository.deleteAll(orphaned);
            cartItemRepository.flush();
        }

        return result;
    }

    public CartItemDTO addToCart(String email, Long productId, int quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        var existing = cartItemRepository.findByUserAndProduct(user, product);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemMapper.toDTO(cartItemRepository.saveAndFlush(item));
        }

        CartItem item = CartItem.builder().user(user).product(product).quantity(quantity).build();
        return cartItemMapper.toDTO(cartItemRepository.saveAndFlush(item));
    }

    public CartItemDTO updateCartItem(String email, Long cartItemId, int quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Not your cart item");
        }

        item.setQuantity(quantity);
        return cartItemMapper.toDTO(cartItemRepository.saveAndFlush(item));
    }

    public void removeCartItem(String email, Long cartItemId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Not your cart item");
        }

        cartItemRepository.delete(item);
        cartItemRepository.flush();
    }

    public void clearCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        cartItemRepository.deleteAllByUser(user);
        cartItemRepository.flush();
    }
}
