package com.university.itp.controller;

import com.university.itp.model.Product;
import com.university.itp.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Path UPLOAD_DIR = Path.of(System.getProperty("java.io.tmpdir"), "ceylon3d-product-images");

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> list(){
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable Long id){
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Create product with multipart image upload */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createWithImage(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {
        String imagePath = null;
        if (image != null && !image.isEmpty()) {
            Files.createDirectories(UPLOAD_DIR);
            String originalName = StringUtils.cleanPath(
                    image.getOriginalFilename() == null ? "image.jpg" : image.getOriginalFilename());
            String storedName = UUID.randomUUID() + "-" + originalName;
            Path target = UPLOAD_DIR.resolve(storedName);
            Files.copy(image.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            imagePath = "/api/products/images/" + storedName;
        }

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .imagePath(imagePath)
                .build();
        productRepository.save(product);
        return ResponseEntity.ok(product);
    }

    /** Serve uploaded product images */
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
        Path filePath = UPLOAD_DIR.resolve(filename);
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }
        Resource resource = new UrlResource(filePath.toUri());
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = "application/octet-stream";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {
        return productRepository.findById(id).map(p -> {
            p.setName(name);
            p.setDescription(description);
            p.setPrice(price);
            p.setStock(stock);
            if (image != null && !image.isEmpty()) {
                try {
                    Files.createDirectories(UPLOAD_DIR);
                    String originalName = StringUtils.cleanPath(
                            image.getOriginalFilename() == null ? "image.jpg" : image.getOriginalFilename());
                    String storedName = UUID.randomUUID() + "-" + originalName;
                    Path target = UPLOAD_DIR.resolve(storedName);
                    Files.copy(image.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                    p.setImagePath("/api/products/images/" + storedName);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload image", e);
                }
            }
            productRepository.save(p);
            return ResponseEntity.ok(p);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        return productRepository.findById(id).map(p -> {
            productRepository.delete(p);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}