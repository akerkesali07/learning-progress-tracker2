package com.example.studentportal.repository;

import com.example.studentportal.model.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findFirstByEmailAndCodeAndUsedFalseAndExpiresAtAfterOrderByExpiresAtDesc(
            String email,
            String code,
            LocalDateTime now
    );
}