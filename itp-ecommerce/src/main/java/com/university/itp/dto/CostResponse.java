package com.university.itp.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostResponse {
    private BigDecimal materialCost;
    private BigDecimal machineCost;
    private BigDecimal energyCost;
    private BigDecimal laborCost;
    private BigDecimal supportCost;
    private BigDecimal totalCost;
    private BigDecimal markup;
    private BigDecimal sellingPrice;
}
