package com.university.itp.service;

import com.university.itp.model.Product;
import com.university.itp.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> listAll() {
        return productRepository.findAll();
    }

    public ResponseEntity<Product> getById(Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public Product create(@Valid Product product) {
        return productRepository.save(product);
    }

    public ResponseEntity<Product> update(Long id, Product body) {
        return productRepository.findById(id).map(p -> {
            p.setName(body.getName());
            p.setDescription(body.getDescription());
            p.setPrice(body.getPrice());
            p.setStock(body.getStock());
            p.setImagePath(body.getImagePath());
            productRepository.save(p);
            return ResponseEntity.ok(p);
        }).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<?> delete(Long id) {
        return productRepository.findById(id).map(p -> {
            productRepository.delete(p);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
