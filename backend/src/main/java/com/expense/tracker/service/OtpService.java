package com.expense.tracker.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private final Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, LocalDateTime> expiryStorage = new HashMap<>();

    // Generate 6-digit OTP
    public String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // Store OTP with 5 min expiry
    public void storeOtp(String email, String otp) {
        otpStorage.put(email, otp);
        expiryStorage.put(email, LocalDateTime.now().plusMinutes(5));
    }

    // Get OTP only if not expired
    public String getOtp(String email) {

        if (!otpStorage.containsKey(email)) {
            return null;
        }

        LocalDateTime expiry = expiryStorage.get(email);

        if (expiry == null || LocalDateTime.now().isAfter(expiry)) {
            otpStorage.remove(email);
            expiryStorage.remove(email);
            return null;
        }

        return otpStorage.get(email);
    }

    // Clear OTP after successful verification
    public void clearOtp(String email) {
        otpStorage.remove(email);
        expiryStorage.remove(email);
    }
}