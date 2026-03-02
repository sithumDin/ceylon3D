package com.university.itp.controller;

import com.university.itp.model.StlOrder;
import com.university.itp.repository.StlOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/stl-orders")
public class StlOrderController {

    private static final Set<String> ALLOWED_MATERIALS = Set.of("PLA", "ABS", "PETG", "RESIN");

    @Autowired
    private StlOrderRepository stlOrderRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public List<StlOrder> allStlOrders() {
        return stlOrderRepository.findAllByOrderByCreatedAtDesc();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StlOrder req) {
        return stlOrderRepository.findById(id).map(order -> {
            order.setStatus(req.getStatus());
            stlOrderRepository.save(order);
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/calculate-cost")
    public ResponseEntity<Map<String, Object>> calculateCost(@RequestBody Map<String, Object> req) {
        long fileSizeBytes = extractLong(req.get("fileSizeBytes"), 0L);
        int quantity = (int) extractLong(req.get("quantity"), 1L);
        String material = normalizeMaterial((String) req.get("material"));

        if (fileSizeBytes <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "fileSizeBytes must be greater than 0"));
        }

        if (quantity < 1) {
            quantity = 1;
        }

        BigDecimal estimatedPrice = calculateEstimatedPrice(fileSizeBytes, material, quantity);

        return ResponseEntity.ok(Map.of(
                "material", material,
                "quantity", quantity,
                "fileSizeBytes", fileSizeBytes,
                "estimatedPrice", estimatedPrice
        ));
    }

    private String normalizeMaterial(String material) {
        if (material == null || material.isBlank()) {
            return "PLA";
        }

        String normalized = material.trim().toUpperCase();
        return ALLOWED_MATERIALS.contains(normalized) ? normalized : "PLA";
    }

    private long extractLong(Object value, long fallback) {
        if (value instanceof Number number) {
            return number.longValue();
        }

        if (value instanceof String text) {
            try {
                return Long.parseLong(text.trim());
            } catch (NumberFormatException ignored) {
                return fallback;
            }
        }

        return fallback;
    }

    private BigDecimal calculateEstimatedPrice(long fileSizeBytes, String material, int quantity) {
        BigDecimal baseCharge = BigDecimal.valueOf(8.00);
        BigDecimal sizeInMb = BigDecimal.valueOf(fileSizeBytes)
                .divide(BigDecimal.valueOf(1024 * 1024), 4, RoundingMode.HALF_UP);
        BigDecimal sizeCost = sizeInMb.multiply(BigDecimal.valueOf(4.00));
        BigDecimal materialMultiplier = switch (material) {
            case "ABS" -> BigDecimal.valueOf(1.15);
            case "PETG" -> BigDecimal.valueOf(1.30);
            case "RESIN" -> BigDecimal.valueOf(1.60);
            default -> BigDecimal.ONE;
        };

        BigDecimal unitPrice = baseCharge.add(sizeCost).multiply(materialMultiplier);
        return unitPrice.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
    }
}
