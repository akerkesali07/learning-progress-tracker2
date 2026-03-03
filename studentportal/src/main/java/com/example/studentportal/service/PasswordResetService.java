package com.example.studentportal.service;

import com.example.studentportal.model.PasswordResetToken;
import com.example.studentportal.model.User;
import com.example.studentportal.repository.PasswordResetTokenRepository;
import com.example.studentportal.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@Slf4j
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final Random random = new Random();

    public PasswordResetService(PasswordResetTokenRepository tokenRepository,
                                UserRepository userRepository,
                                EmailService emailService) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public void createAndSendResetCode(String email) {
        log.info("Password reset requested for email={}", email);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.warn("Password reset requested for non-existing email={}", email);
            return;
        }

        String code = String.format("%06d", random.nextInt(1_000_000));

        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setCode(code);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        token.setUsed(false);
        tokenRepository.save(token);

        emailService.sendPasswordResetCode(email, code);
        log.info("Password reset code sent to email={}", email);
    }

    public void resetPassword(String email, String code, String newPassword) {
        log.info("Reset password attempt email={}, code={}", email, code);

        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("Жаңа құпиясөз толтырылмаған");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Пайдаланушы табылмады");
        }

        Optional<PasswordResetToken> tokenOpt =
                tokenRepository.findFirstByEmailAndCodeAndUsedFalseAndExpiresAtAfterOrderByExpiresAtDesc(
                        email,
                        code,
                        LocalDateTime.now()
                );

        if (tokenOpt.isEmpty()) {
            throw new IllegalArgumentException("Код қате немесе уақыты біткен");
        }

        PasswordResetToken token = tokenOpt.get();
        token.setUsed(true);
        tokenRepository.save(token);

        User user = userOpt.get();
        user.setPassword(newPassword);
        userRepository.save(user);

        log.info("Password reset successful for email={}", email);
    }
}