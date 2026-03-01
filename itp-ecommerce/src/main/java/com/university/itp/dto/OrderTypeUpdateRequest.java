package com.university.itp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderTypeUpdateRequest {
    @NotBlank
    private String orderType;
}
