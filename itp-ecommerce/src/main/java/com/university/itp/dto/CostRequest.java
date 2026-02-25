package com.university.itp.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CostRequest {
    private int hours;
    private int minutes;
    private double weightGrams;
    private String material;
    private boolean supportStructures;
}
