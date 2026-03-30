package com.university.itp.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "stl_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StlOrder {

    @Id
    private String id;

    private String customerName;

    private String customerEmail;

    private String customerEmail2;

    private String phone;

    private String address;

    private String fileName;

    private Long fileSizeBytes;

    private String material;

    private Integer quantity;

    private BigDecimal estimatedPrice;

    private Integer printTimeHours;

    private Integer printTimeMinutes;

    private Double weightGrams;

    private Boolean supportStructures;

    /** Linked user account (null if uploaded anonymously with no matching user) */
    private String userId;

    @Field("note")
    private String note;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private String status = "PENDING_QUOTE";
}
