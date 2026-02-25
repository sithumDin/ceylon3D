package com.university.itp.controller;

import com.university.itp.dto.CostRequest;
import com.university.itp.dto.CostResponse;
import com.university.itp.service.PricingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {

    private final PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<CostResponse> calculate(@RequestBody CostRequest req){
        CostResponse resp = pricingService.calculate(req);
        return ResponseEntity.ok(resp);
    }
}
