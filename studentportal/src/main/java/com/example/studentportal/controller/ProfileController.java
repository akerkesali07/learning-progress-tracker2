package com.example.studentportal.controller;

import com.example.studentportal.model.User;
import com.example.studentportal.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public User getProfile(@PathVariable String id) {
        log.info("Get profile id={}", id);
        return service.getAll().stream()
                .filter(u -> id.equals(u.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Пайдаланушы табылмады"));
    }

    @PutMapping("/{id}")
    public User updateProfile(@PathVariable String id, @RequestBody User profile) {
        log.info("Update profile id={}", id);
        return service.update(id, profile);
    }
}