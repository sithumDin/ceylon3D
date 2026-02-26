package com.university.itp.controller;

import com.university.itp.dto.RegisterRequest;
import com.university.itp.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.test.web.client.TestRestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanup(){
        userRepository.deleteAll();
    }

    @Test
    void register_requires_mobile() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("u1@example.com");
        req.setPassword("pass123");
        req.setFullName("User One");
        // missing mobile

        ResponseEntity<String> resp = restTemplate.postForEntity("/api/auth/register", new HttpEntity<>(req), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resp.getBody()).contains("mobile");
    }

    @Test
    void register_duplicate_mobile_fails(){
        RegisterRequest r1 = new RegisterRequest();
        r1.setEmail("u2@example.com");
        r1.setPassword("pass123");
        r1.setFullName("User Two");
        r1.setMobile("+12345678901");
        ResponseEntity<String> r1resp = restTemplate.postForEntity("/api/auth/register", new HttpEntity<>(r1), String.class);
        assertThat(r1resp.getStatusCode()).isEqualTo(HttpStatus.OK);

        RegisterRequest r2 = new RegisterRequest();
        r2.setEmail("u3@example.com");
        r2.setPassword("pass123");
        r2.setFullName("User Three");
        r2.setMobile("+12345678901");
        ResponseEntity<String> r2resp = restTemplate.postForEntity("/api/auth/register", new HttpEntity<>(r2), String.class);
        assertThat(r2resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(r2resp.getBody()).contains("Mobile number already in use");
    }
}