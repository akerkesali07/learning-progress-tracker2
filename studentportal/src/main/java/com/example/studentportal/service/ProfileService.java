package com.example.studentportal.service;

import com.example.studentportal.model.User;
import com.example.studentportal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {
    private final UserRepository repo;

    public ProfileService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> getAll() {
        return repo.findAll();
    }

    public User create(User profile) {
        return repo.save(profile);
    }

    public User update(String id, User profile) {
        User existing = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        existing.setFullName(profile.getFullName());
        existing.setEmail(profile.getEmail());
        existing.setMajor(profile.getMajor());
        existing.setGroupName(profile.getGroupName());
        // егер пароль өзгертілсе:
        if (profile.getPassword() != null && !profile.getPassword().isEmpty()) {
            existing.setPassword(profile.getPassword());
        }
        return repo.save(existing);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
