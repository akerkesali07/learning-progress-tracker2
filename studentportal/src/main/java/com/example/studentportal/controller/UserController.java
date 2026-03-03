package com.example.studentportal.controller;

import com.example.studentportal.exception.NotFoundException;
import com.example.studentportal.model.User;
import com.example.studentportal.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();
        log.debug("Total users found: {}", users.size());
        return users;
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        log.info("Fetching user by id={}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пайдаланушы табылмады"));
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User updated) {
        log.info("Updating user id={}", id);
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пайдаланушы табылмады"));

        if (updated.getFullName() == null || updated.getFullName().isBlank()) {
            throw new IllegalArgumentException("Аты-жөні толтырылмаған");
        }
        if (updated.getEmail() == null || updated.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email толтырылмаған");
        }

        existing.setFullName(updated.getFullName());
        existing.setEmail(updated.getEmail());
        existing.setMajor(updated.getMajor());
        existing.setGroupName(updated.getGroupName());
        if (updated.getRole() != null && !updated.getRole().isBlank()) {
            existing.setRole(updated.getRole());
        }
        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(updated.getPassword());
        }

        User saved = userRepository.save(existing);
        log.info("User updated id={}", saved.getId());
        return saved;
    }
}