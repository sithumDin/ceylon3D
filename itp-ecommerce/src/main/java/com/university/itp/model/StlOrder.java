package com.university.itp.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "stl_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StlOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String customerEmail;

    private String phone;

    private String fileName;

    private Long fileSizeBytes;

    private String material;

    private Integer quantity;

    private BigDecimal estimatedPrice;

    private String status;

    @Column(columnDefinition = "TEXT")
    private String note;

    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
        if (this.status == null || this.status.isBlank()) {
            this.status = "PENDING_QUOTE";
        }
    }
}
