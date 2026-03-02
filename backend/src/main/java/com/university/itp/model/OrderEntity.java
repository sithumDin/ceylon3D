package com.university.itp.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	private User user;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<OrderItem> items = new ArrayList<>();

	private BigDecimal totalAmount;

	@Enumerated(EnumType.STRING)
	private OrderCategory category;

	private String status;

	@Column(columnDefinition = "TEXT")
	private String shippingAddress;

	private Instant createdAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = Instant.now();
		if (this.category == null) {
			this.category = OrderCategory.SHOP;
		}
	}
}
