package com.example.studentportal.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail; 

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetCode(String toEmail, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);          
            message.setTo(toEmail);
            message.setSubject("Құпиясөзді қалпына келтіру коды");
            message.setText(
                    "Сіздің құпиясөзіңізді қалпына келтіру коды: " + code +
                    "\nКод 10 минутқа жарамды."
            );

            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send reset email to {}. Code was: {}", toEmail, code, e);
        }
    }
}