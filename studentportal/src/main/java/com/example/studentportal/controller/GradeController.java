package com.example.studentportal.controller;

import com.example.studentportal.model.Grade;
import com.example.studentportal.repository.GradeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:5173")
public class GradeController {
    private final GradeRepository gradeRepository;

    public GradeController(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    @GetMapping
    public List<Grade> getAllGrades() {
        log.info("Fetch all grades");
        List<Grade> grades = gradeRepository.findAll();
        log.debug("Total grades: {}", grades.size());
        return grades;
    }

    @GetMapping("/average/{userId}")
    public double getAverageGrade(@PathVariable String userId) {
        log.info("Get average grade for userId={}", userId);
        List<Grade> grades = gradeRepository.findByUserId(userId);
        if (grades == null || grades.isEmpty()) return 0.0;

        return grades.stream()
                .mapToDouble(Grade::getScore)
                .average()
                .orElse(0.0);
    }

    @GetMapping("/transcript/{userId}")
    public Map<String, Object> getTranscript(@PathVariable String userId) {
        log.info("Get transcript for userId={}", userId);
        List<Grade> grades = gradeRepository.findByUserId(userId);
        Map<String, Object> transcript = new HashMap<>();

        if (grades == null || grades.isEmpty()) {
            transcript.put("average", 0.0);
            transcript.put("courses", List.of());
            return transcript;
        }

        Map<String, Double> courseAverages = grades.stream()
                .collect(Collectors.groupingBy(
                        Grade::getCourseName,
                        Collectors.averagingDouble(Grade::getScore)
                ));

        double totalAverage = courseAverages.values().stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        transcript.put("average", totalAverage);
        transcript.put("courses", courseAverages);
        return transcript;
    }

    @DeleteMapping("/{id}")
    public void deleteGrade(@PathVariable String id) {
        log.warn("Delete grade id={}", id);
        gradeRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Grade updateGrade(@PathVariable String id, @RequestBody Grade updated) {
        log.info("Update grade id={}", id);
        Grade existing = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        existing.setUserId(updated.getUserId());
        existing.setCourseName(updated.getCourseName());
        existing.setTask(updated.getTask());
        existing.setScore(updated.getScore());
        existing.setDate(updated.getDate());

        Grade saved = gradeRepository.save(existing);
        log.info("Grade updated id={}", saved.getId());
        return saved;
    }

}