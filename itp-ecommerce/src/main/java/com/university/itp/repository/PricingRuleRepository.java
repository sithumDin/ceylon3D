package com.university.itp.repository;

import com.university.itp.model.PricingRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PricingRuleRepository extends JpaRepository<PricingRule, Long> {
    Optional<PricingRule> findByMaterial(String material);
}
