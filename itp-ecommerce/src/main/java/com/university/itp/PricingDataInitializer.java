package com.university.itp;

import com.university.itp.model.PricingRule;
import com.university.itp.repository.PricingRuleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class PricingDataInitializer {

    @Bean
    CommandLineRunner initPricing(PricingRuleRepository pricingRuleRepository){
        return args -> {
            if(pricingRuleRepository.count() == 0){
                pricingRuleRepository.save(PricingRule.builder()
                        .material("PLA")
                        .pricePerGram(BigDecimal.valueOf(5))
                        .machinePerHour(BigDecimal.valueOf(50))
                        .energyPerHour(BigDecimal.valueOf(30))
                        .supportCost(BigDecimal.valueOf(100))
                        .laborCost(BigDecimal.valueOf(100))
                        .markup(BigDecimal.valueOf(1.5))
                        .build());

                pricingRuleRepository.save(PricingRule.builder()
                        .material("ABS")
                        .pricePerGram(BigDecimal.valueOf(6))
                        .machinePerHour(BigDecimal.valueOf(50))
                        .energyPerHour(BigDecimal.valueOf(30))
                        .supportCost(BigDecimal.valueOf(120))
                        .laborCost(BigDecimal.valueOf(100))
                        .markup(BigDecimal.valueOf(1.6))
                        .build());
            }
        };
    }
}
