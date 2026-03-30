package com.university.itp.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    private String id;

    private String name;

    @Field("description")
    private String description;

    private BigDecimal price;

    private Integer stock;

    private String imagePath;

    private String category;

    @Builder.Default
    private Instant createdAt = Instant.now();
}