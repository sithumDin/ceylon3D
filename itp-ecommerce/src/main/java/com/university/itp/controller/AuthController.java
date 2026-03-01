package com.university.itp.controller;

import com.university.itp.dto.AuthResponse;
import com.university.itp.dto.LoginRequest;
import com.university.itp.dto.RegisterRequest;
import com.university.itp.dto.UserDTO;
import com.university.itp.model.Role;
import com.university.itp.model.User;
import com.university.itp.repository.UserRepository;
import com.university.itp.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        User u = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .roles(Collections.singleton(Role.ROLE_CUSTOMER))
                .build();
        userRepository.save(u);
        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, "Bearer", UserDTO.from(u)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User u = userRepository.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, "Bearer", UserDTO.from(u)));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        User u = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(UserDTO.from(u));
    }
}