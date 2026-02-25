package com.university.itp.service;

import com.university.itp.dto.CostRequest;
import com.university.itp.dto.CostResponse;
import com.university.itp.model.PricingRule;
import com.university.itp.repository.PricingRuleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PricingService {

    private final PricingRuleRepository pricingRuleRepository;

    public PricingService(PricingRuleRepository pricingRuleRepository) {
        this.pricingRuleRepository = pricingRuleRepository;
    }

    public CostResponse calculate(CostRequest req) {
        String material = req.getMaterial() == null ? "PLA" : req.getMaterial();
        PricingRule rule = pricingRuleRepository.findByMaterial(material).orElseGet(() -> defaultRule(material));

        double durationHours = Math.max(0, req.getHours()) + Math.max(0, Math.min(59, req.getMinutes())) / 60.0;

        BigDecimal materialCost = rule.getPricePerGram().multiply(BigDecimal.valueOf(req.getWeightGrams()));
        BigDecimal machineCost = rule.getMachinePerHour().multiply(BigDecimal.valueOf(durationHours));
        BigDecimal energyCost = rule.getEnergyPerHour().multiply(BigDecimal.valueOf(durationHours));
        BigDecimal supportCost = req.isSupportStructures() ? rule.getSupportCost() : BigDecimal.ZERO;
        BigDecimal laborCost = rule.getLaborCost();

        BigDecimal totalCost = materialCost.add(machineCost).add(energyCost).add(laborCost).add(supportCost);
        BigDecimal sellingPrice = totalCost.multiply(rule.getMarkup());

        return CostResponse.builder()
                .materialCost(materialCost)
                .machineCost(machineCost)
                .energyCost(energyCost)
                .laborCost(laborCost)
                .supportCost(supportCost)
                .totalCost(totalCost)
                .markup(rule.getMarkup())
                .sellingPrice(sellingPrice)
                .build();
    }

    private PricingRule defaultRule(String material){
        return PricingRule.builder()
                .material(material)
                .pricePerGram(BigDecimal.valueOf(5))
                .machinePerHour(BigDecimal.valueOf(50))
                .energyPerHour(BigDecimal.valueOf(30))
                .supportCost(BigDecimal.valueOf(100))
                .laborCost(BigDecimal.valueOf(100))
                .markup(BigDecimal.valueOf(1.5))
                .build();
    }
}
