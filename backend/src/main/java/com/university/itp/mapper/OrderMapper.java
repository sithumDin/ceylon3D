package com.university.itp.mapper;

import com.university.itp.dto.OrderDTO;
import com.university.itp.dto.OrderItemDTO;
import com.university.itp.model.OrderEntity;
import com.university.itp.model.OrderItem;
import com.university.itp.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface OrderMapper {
    OrderDTO toDTO(OrderEntity orderEntity);
    OrderEntity toEntity(OrderDTO orderDTO);

    @Mapping(source = "product", target = "productId", qualifiedByName = "productToId")
    OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    @Mapping(source = "productId", target = "product", qualifiedByName = "idToProduct")
    @Mapping(target = "order", ignore = true)
    OrderItem toOrderItemEntity(OrderItemDTO orderItemDTO);

    @Named("productToId")
    default Long productToId(Product product) {
        if (product == null) {
            return null;
        }
        return product.getId();
    }

    @Named("idToProduct")
    default Product idToProduct(Long id) {
        if (id == null) {
            return null;
        }
        Product product = new Product();
        product.setId(id);
        return product;
    }
}
