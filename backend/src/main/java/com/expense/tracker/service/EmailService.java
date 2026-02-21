package com.expense.tracker.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Expense App OTP Verification");
        message.setText("Your OTP is: " + otp);

        mailSender.send(message);
        try {
    mailSender.send(message);
    System.out.println("EMAIL SENT SUCCESSFULLY");
} catch (Exception e) {
    e.printStackTrace();
}
    }
    
}