package com.example.studentportal.controller;

import com.example.studentportal.model.Homework;
import com.example.studentportal.repository.HomeworkRepository;
import com.example.studentportal.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/homeworks")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminHomeworkController {

    private final HomeworkRepository homeworkRepository;
    private final UserRepository userRepository;

    public AdminHomeworkController(HomeworkRepository homeworkRepository,
                                   UserRepository userRepository) {
        this.homeworkRepository = homeworkRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Homework> getHomeworksByUser(@RequestParam String userId) {
        log.info("Admin: get homeworks for userId={}", userId);
        List<Homework> list = homeworkRepository.findByUserId(userId);
        log.info("Admin: homeworks size={}", list.size());
        return list;
    }

    @PostMapping
    public Homework addHomework(@RequestBody Homework hw) {
        log.info("Admin: add homework userId={}, subject={}, title={}",
                hw.getUserId(), hw.getSubject(), hw.getTitle());

        if (hw.getUserId() == null || hw.getUserId().isBlank()) {
            throw new IllegalArgumentException("Студент таңдалмаған");
        }
        if (!userRepository.existsById(hw.getUserId())) {
            throw new IllegalArgumentException("Студент табылмады");
        }
        if (hw.getSubject() == null || hw.getSubject().isBlank()) {
            throw new IllegalArgumentException("Пән толтырылмаған");
        }
        if (hw.getTitle() == null || hw.getTitle().isBlank()) {
            throw new IllegalArgumentException("Тақырып толтырылмаған");
        }

        Homework saved = homeworkRepository.save(hw);
        log.info("Admin: homework created id={}", saved.getId());
        return saved;
    }

    @PutMapping("/{id}")
    public Homework updateHomework(@PathVariable String id, @RequestBody Homework hw) {
        log.info("Admin: update homework id={}", id);

        Homework existing = homeworkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Үй тапсырмасы табылмады"));

        existing.setSubject(hw.getSubject());
        existing.setTitle(hw.getTitle());
        existing.setDueDate(hw.getDueDate());
        existing.setStatus(hw.getStatus());
        existing.setUserId(hw.getUserId());
        existing.setCompleted(hw.isCompleted());
        existing.setStudyMinutes(hw.getStudyMinutes());
        existing.setStudyDate(hw.getStudyDate());

        Homework saved = homeworkRepository.save(existing);
        log.info("Admin: homework updated id={}", saved.getId());
        return saved;
    }

    @DeleteMapping("/{id}")
    public void deleteHomework(@PathVariable String id) {
        log.warn("Admin: delete homework id={}", id);
        homeworkRepository.deleteById(id);
    }
}