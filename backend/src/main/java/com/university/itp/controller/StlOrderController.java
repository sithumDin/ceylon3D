package com.university.itp.controller;

import com.university.itp.model.StlOrder;
import com.university.itp.model.OrderEntity;
import com.university.itp.model.OrderItem;
import com.university.itp.model.OrderCategory;
import com.university.itp.model.User;
import com.university.itp.repository.StlOrderRepository;
import com.university.itp.repository.OrderRepository;
import com.university.itp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/stl-orders")
public class StlOrderController {

    private static final Set<String> ALLOWED_MATERIALS = Set.of("PLA", "PLA+", "ABS", "ABS+");

    @Autowired
    private StlOrderRepository stlOrderRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    /** Get the logged-in user's own STL orders (matched by userId OR email) */
    @GetMapping("/my")
    public List<StlOrder> myStlOrders(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        Long userId = user != null ? user.getId() : -1L;
        return stlOrderRepository.findByUserIdOrEmail(userId, email);
    }

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

            // Save calculation details
            if (req.containsKey("printTimeHours")) {
                order.setPrintTimeHours(((Number) req.get("printTimeHours")).intValue());
            }
            if (req.containsKey("printTimeMinutes")) {
                order.setPrintTimeMinutes(((Number) req.get("printTimeMinutes")).intValue());
            }
            if (req.containsKey("weightGrams")) {
                order.setWeightGrams(((Number) req.get("weightGrams")).doubleValue());
            }
            if (req.containsKey("supportStructures")) {
                order.setSupportStructures(Boolean.TRUE.equals(req.get("supportStructures")));
            }
            if (req.containsKey("material")) {
                order.setMaterial(normalizeMaterial((String) req.get("material")));
            }

            // Auto-set status to QUOTED when price is calculated
            if ("PENDING_QUOTE".equals(order.getStatus())) {
                order.setStatus("QUOTED");
            }
            stlOrderRepository.save(order);
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }

    /** User updates their own STL order (only allowed while PENDING_QUOTE) */
    @PutMapping("/my/{id}")
    public ResponseEntity<?> updateMyOrder(@PathVariable Long id, @RequestBody Map<String, Object> req, Authentication auth) {
        String email = auth.getName();
        return stlOrderRepository.findById(id).map(order -> {
            if (!email.equalsIgnoreCase(order.getCustomerEmail())) {
                return ResponseEntity.status(403).body(Map.of("message", "You can only update your own orders"));
            }
            if (!"PENDING_QUOTE".equals(order.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Only pending orders can be updated"));
            }
            if (req.containsKey("material")) {
                String mat = normalizeMaterial((String) req.get("material"));
                order.setMaterial(mat);
            }
            if (req.containsKey("quantity")) {
                int qty = ((Number) req.get("quantity")).intValue();
                if (qty < 1) qty = 1;
                order.setQuantity(qty);
            }
            if (req.containsKey("note")) {
                order.setNote((String) req.get("note"));
            }
            stlOrderRepository.save(order);
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }

    /** User confirms a QUOTED STL order — changes status to CONFIRMED and creates a shop order */
    @PutMapping("/my/{id}/confirm")
    public ResponseEntity<?> confirmOrder(@PathVariable Long id, Authentication auth) {
        String email = auth.getName();
        return stlOrderRepository.findById(id).map(order -> {
            // Only the owner can confirm their own order
            if (!email.equalsIgnoreCase(order.getCustomerEmail())) {
                return ResponseEntity.status(403).body(Map.of("message", "You can only confirm your own orders"));
            }
            // Only QUOTED orders can be confirmed
            if (!"QUOTED".equals(order.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Only quoted orders can be confirmed"));
            }
            order.setStatus("CONFIRMED");
            stlOrderRepository.save(order);

            // Create a shop order so it appears in the orders list
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                OrderEntity shopOrder = new OrderEntity();
                shopOrder.setUser(user);
                shopOrder.setCategory(OrderCategory.STL);
                shopOrder.setStatus("PENDING");
                shopOrder.setTotalAmount(order.getEstimatedPrice());
                shopOrder.setShippingAddress(order.getCustomerName() + "\n" + (order.getPhone() != null ? order.getPhone() : ""));

                // Build the file name without the UUID prefix
                String displayFileName = order.getFileName();
                if (displayFileName != null) {
                    int dashIdx = displayFileName.indexOf('-');
                    if (dashIdx > 0 && dashIdx < displayFileName.length() - 1) {
                        displayFileName = displayFileName.substring(dashIdx + 1);
                    }
                }

                OrderItem item = new OrderItem();
                item.setOrder(shopOrder);
                item.setProductName("3D Print: " + (displayFileName != null ? displayFileName : "STL File") + " (" + order.getMaterial() + ")");
                item.setQuantity(order.getQuantity() != null ? order.getQuantity() : 1);
                item.setUnitPrice(order.getEstimatedPrice());

                List<OrderItem> items = new ArrayList<>();
                items.add(item);
                shopOrder.setItems(items);

                orderRepository.save(shopOrder);
            }

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
