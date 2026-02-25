package com.university.itp.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "pricing_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String material;

    @Column(name = "price_per_gram")
    private BigDecimal pricePerGram;

    @Column(name = "machine_per_hour")
    private BigDecimal machinePerHour;

    @Column(name = "energy_per_hour")
    private BigDecimal energyPerHour;

    @Column(name = "support_cost")
    private BigDecimal supportCost;

    @Column(name = "labor_cost")
    private BigDecimal laborCost;

    private BigDecimal markup;
}
