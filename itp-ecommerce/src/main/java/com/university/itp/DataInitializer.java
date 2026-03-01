package com.university.itp;

import com.university.itp.model.Product;
import com.university.itp.model.Role;
import com.university.itp.model.User;
import com.university.itp.repository.ProductRepository;
import com.university.itp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Set;

@Configuration
public class DataInitializer {

    private static final String MASTER_ADMIN_EMAIL = "admin@itp.edu";
    private static final String MASTER_ADMIN_PASSWORD = "adminpass";
    private static final String MASTER_ADMIN_NAME = "Master Admin";

    @Bean
    CommandLineRunner init(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder encoder){
        return args -> {
            User masterAdmin = userRepository.findByEmail(MASTER_ADMIN_EMAIL).orElse(null);
            if(masterAdmin == null){
                masterAdmin = User.builder()
                        .email(MASTER_ADMIN_EMAIL)
                        .password(encoder.encode(MASTER_ADMIN_PASSWORD))
                        .fullName(MASTER_ADMIN_NAME)
                        .roles(Set.of(Role.ROLE_ADMIN))
                        .build();
            } else {
                masterAdmin.setRoles(Set.of(Role.ROLE_ADMIN));
                if(masterAdmin.getFullName() == null || masterAdmin.getFullName().isBlank()){
                    masterAdmin.setFullName(MASTER_ADMIN_NAME);
                }
            }
            userRepository.save(masterAdmin);

            if(productRepository.count() == 0){
                productRepository.save(Product.builder()
                        .name("PLA Filament 1kg")
                        .description("High quality 1kg PLA filament")
                        .price(new BigDecimal("19.99"))
                        .stock(100)
                        .imagePath("/assets/filament.jpg")
                        .build());

                productRepository.save(Product.builder()
                        .name("Resin 1L")
                        .description("Standard resin")
                        .price(new BigDecimal("29.99"))
                        .stock(50)
                        .imagePath("/assets/resin.jpg")
                        .build());
            }
        };
    }
}