package com.university.itp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StlOrderDTO {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String phone;
    private String fileName;
    private Long fileSizeBytes;
    private String material;
    private Integer quantity;
    private BigDecimal estimatedPrice;
    private Integer printTimeHours;
    private Integer printTimeMinutes;
    private Double weightGrams;
    private Boolean supportStructures;
    private String status;
    private Long userId;
    private String note;
    private Instant createdAt;
}
