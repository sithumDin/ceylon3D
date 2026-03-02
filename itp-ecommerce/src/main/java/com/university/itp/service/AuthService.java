package com.university.itp.service;

import com.university.itp.dto.AuthResponse;
import com.university.itp.dto.LoginRequest;
import com.university.itp.dto.RegisterRequest;
import com.university.itp.dto.UserDTO;
import com.university.itp.model.Role;
import com.university.itp.model.User;
import com.university.itp.repository.UserRepository;
import com.university.itp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public ResponseEntity<?> register(RegisterRequest req) {
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

    public ResponseEntity<?> login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User u = userRepository.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, "Bearer", UserDTO.from(u)));
    }

    public UserDTO me(String email) {
        User u = userRepository.findByEmail(email).orElseThrow();
        return UserDTO.from(u);
    }
}
