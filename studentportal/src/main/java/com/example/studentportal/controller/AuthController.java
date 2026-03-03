package com.example.studentportal.controller;

import com.example.studentportal.model.User;
import com.example.studentportal.repository.UserRepository;
import com.example.studentportal.service.PasswordResetService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordResetService passwordResetService;

    public AuthController(UserRepository userRepository,
                          PasswordResetService passwordResetService) {
        this.userRepository = userRepository;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        log.info("Register request: email={}", user.getEmail());

        Map<String, Object> response = new HashMap<>();

        if (user.getFullName() == null || user.getFullName().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()) {
            log.warn("Register validation failed for email={}", user.getEmail());
            response.put("success", false);
            response.put("message", "Барлық өрістерді толтырыңыз");
            return response;
        }

        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            log.warn("Register failed, email already exists: {}", user.getEmail());
            response.put("success", false);
            response.put("message", "Бұл email тіркелген");
            return response;
        }

        User saved = userRepository.save(user);
        log.info("User registered successfully: id={}, email={}", saved.getId(), saved.getEmail());

        response.put("success", true);
        response.put("userId", saved.getId());
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        log.info("Login attempt: email={}", email);
        Map<String, Object> response = new HashMap<>();

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            log.warn("Login validation failed: empty email or password");
            response.put("success", false);
            response.put("message", "Email және пароль енгізіңіз");
            return response;
        }

        Optional<User> found = userRepository.findByEmail(email);
        if (found.isEmpty()) {
            log.warn("Login failed, user not found: {}", email);
            response.put("success", false);
            response.put("message", "Қате email немесе пароль");
            return response;
        }

        if (!found.get().getPassword().equals(password)) {
            log.warn("Login failed, wrong password for email={}", email);
            response.put("success", false);
            response.put("message", "Қате email немесе пароль");
            return response;
        }

        log.info("Login success: userId={}, role={}", found.get().getId(), found.get().getRole());

        response.put("success", true);
        response.put("userId", found.get().getId());
        response.put("role", found.get().getRole());
        return response;
    }

    @PostMapping("/forgot-password")
    public Map<String, Object> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        log.info("Forgot password request email={}", email);

        Map<String, Object> response = new HashMap<>();
        if (email == null || email.isBlank()) {
            response.put("success", false);
            response.put("message", "Email енгізіңіз");
            return response;
        }

        passwordResetService.createAndSendResetCode(email);

        response.put("success", true);
        response.put("message", "Егер email тіркелген болса, код почтаға жіберілді");
        return response;
    }

    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");
        String newPassword = body.get("newPassword");

        log.info("Reset password request email={}", email);

        Map<String, Object> response = new HashMap<>();

        if (email == null || email.isBlank()
                || code == null || code.isBlank()
                || newPassword == null || newPassword.isBlank()) {
            response.put("success", false);
            response.put("message", "Email, код және жаңа құпиясөз толтырылуы керек");
            return response;
        }

        passwordResetService.resetPassword(email, code, newPassword);

        response.put("success", true);
        response.put("message", "Құпиясөз сәтті өзгертілді");
        return response;
    }
}