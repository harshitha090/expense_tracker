package com.expense.tracker.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expense.tracker.model.User;
import com.expense.tracker.repository.UserRepository;
import com.expense.tracker.service.EmailService;
import com.expense.tracker.service.OtpService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;

    public AuthController(UserRepository userRepository,
                          OtpService otpService,
                          EmailService emailService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    // ================= SEND OTP =================
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email is required"));
        }

        if (userRepository.findByEmail(email) != null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already in use"));
        }

        String otp = otpService.generateOtp();
        otpService.storeOtp(email, otp);

        emailService.sendOtp(email, otp);

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody User request) {

        String storedOtp = otpService.getOtp(request.getEmail());

        if (storedOtp == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "OTP expired"));
        }

        if (!storedOtp.equals(request.getOtp())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid OTP"));
        }

        User newUser = new User(
                request.getName(),
                request.getUsername(),
                request.getEmail(),
                request.getPassword()
        );

        newUser.setVerified(true);

        userRepository.save(newUser);

        otpService.clearOtp(request.getEmail());

        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User existingUser = userRepository.findByUsername(user.getUsername());

        if (existingUser == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "User not found"));
        }

        if (!existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Incorrect password"));
        }

        if (!existingUser.isVerified()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email not verified"));
        }

        return ResponseEntity.ok(existingUser);
    }
}