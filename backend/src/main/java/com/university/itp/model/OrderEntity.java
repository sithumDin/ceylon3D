package com.university.itp.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity {

	@Id
	private String id;

	@DBRef
	private User user;

	@Builder.Default
	private List<OrderItem> items = new ArrayList<>();

	private BigDecimal totalAmount;

	private OrderCategory category;

	private String status;

	@Field("shippingAddress")
	private String shippingAddress;

	private String trackingNumber;

	@Builder.Default
	private Instant createdAt = Instant.now();
}
