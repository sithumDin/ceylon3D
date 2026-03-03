package com.university.itp.controller;

import com.university.itp.model.StlOrder;
import com.university.itp.repository.StlOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/stl-orders")
public class StlOrderController {

    private static final Set<String> ALLOWED_MATERIALS = Set.of("PLA", "PLA+", "ABS", "ABS+");

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

    /** Update the estimated price for an STL order (admin calculates and sets price) */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin/{id}/price")
    public ResponseEntity<?> updatePrice(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        return stlOrderRepository.findById(id).map(order -> {
            BigDecimal price = new BigDecimal(req.get("estimatedPrice").toString());
            order.setEstimatedPrice(price);
            // Auto-set status to QUOTED when price is calculated
            if ("PENDING_QUOTE".equals(order.getStatus())) {
                order.setStatus("QUOTED");
            }
            stlOrderRepository.save(order);
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Delete an STL order */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteStlOrder(@PathVariable Long id) {
        return stlOrderRepository.findById(id).map(order -> {
            // Try to delete the uploaded file
            try {
                Path uploadDir = Path.of(System.getProperty("java.io.tmpdir"), "ceylon3d-uploads");
                Path filePath = uploadDir.resolve(order.getFileName());
                Files.deleteIfExists(filePath);
            } catch (Exception ignored) {
                // File may already be deleted; continue with DB removal
            }
            stlOrderRepository.delete(order);
            return ResponseEntity.ok(Map.of("message", "STL order deleted"));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Download the uploaded file for an STL order */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        var optionalOrder = stlOrderRepository.findById(id);
        if (optionalOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        StlOrder order = optionalOrder.get();
        try {
            Path uploadDir = Path.of(System.getProperty("java.io.tmpdir"), "ceylon3d-uploads");
            Path filePath = uploadDir.resolve(order.getFileName());
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            Resource resource = new UrlResource(filePath.toUri());

            // Extract original filename (strip UUID prefix)
            String originalName = order.getFileName();
            int dashIndex = originalName.indexOf('-');
            if (dashIndex > 0 && dashIndex < originalName.length() - 1) {
                originalName = originalName.substring(dashIndex + 1);
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originalName + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Calculate 3D print cost based on the PDF formula:
     * Selling Price = (Material Cost + Machine Cost + Energy Cost + Labor Cost + Support Cost) × 1.5
     *
     * Inputs: printTimeHours, printTimeMinutes, weightGrams, material, supportStructures
     */
    @PostMapping("/calculate-cost")
    public ResponseEntity<Map<String, Object>> calculateCost(@RequestBody Map<String, Object> req) {
        int printTimeHours = (int) extractLong(req.get("printTimeHours"), 0L);
        int printTimeMinutes = (int) extractLong(req.get("printTimeMinutes"), 0L);
        double weightGrams = extractDouble(req.get("weightGrams"), 0.0);
        String material = normalizeMaterial((String) req.get("material"));
        boolean supportStructures = Boolean.TRUE.equals(req.get("supportStructures"));

        if (weightGrams <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "weightGrams must be greater than 0"));
        }

        double totalHours = printTimeHours + (printTimeMinutes / 60.0);

        // Material Cost: PLA/PLA+ = LKR 5.00/g, ABS/ABS+ = LKR 6.00/g
        double materialRate = (material.startsWith("ABS")) ? 6.00 : 5.00;
        BigDecimal materialCost = BigDecimal.valueOf(weightGrams * materialRate);

        // Machine Cost: LKR 50.00/hour
        BigDecimal machineCost = BigDecimal.valueOf(totalHours * 50.00);

        // Energy Cost: LKR 30.00/hour
        BigDecimal energyCost = BigDecimal.valueOf(totalHours * 30.00);

        // Labor Cost: LKR 100.00 flat
        BigDecimal laborCost = BigDecimal.valueOf(100.00);

        // Support Structure Cost: LKR 100.00 if enabled
        BigDecimal supportCost = supportStructures ? BigDecimal.valueOf(100.00) : BigDecimal.ZERO;

        // Total Cost
        BigDecimal totalCost = materialCost.add(machineCost).add(energyCost).add(laborCost).add(supportCost);

        // Selling Price = Total Cost × 1.5
        BigDecimal sellingPrice = totalCost.multiply(BigDecimal.valueOf(1.5)).setScale(2, RoundingMode.HALF_UP);

        Map<String, Object> result = new HashMap<>();
        result.put("material", material);
        result.put("weightGrams", weightGrams);
        result.put("printTimeHours", printTimeHours);
        result.put("printTimeMinutes", printTimeMinutes);
        result.put("supportStructures", supportStructures);
        result.put("materialCost", materialCost.setScale(2, RoundingMode.HALF_UP));
        result.put("machineCost", machineCost.setScale(2, RoundingMode.HALF_UP));
        result.put("energyCost", energyCost.setScale(2, RoundingMode.HALF_UP));
        result.put("laborCost", laborCost.setScale(2, RoundingMode.HALF_UP));
        result.put("supportCost", supportCost.setScale(2, RoundingMode.HALF_UP));
        result.put("totalCost", totalCost.setScale(2, RoundingMode.HALF_UP));
        result.put("sellingPrice", sellingPrice);

        return ResponseEntity.ok(result);
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

    private double extractDouble(Object value, double fallback) {
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        if (value instanceof String text) {
            try {
                return Double.parseDouble(text.trim());
            } catch (NumberFormatException ignored) {
                return fallback;
            }
        }
        return fallback;
    }
}
