package com.example.studentportal.controller;

import com.example.studentportal.model.Grade;
import com.example.studentportal.repository.CourseRepository;
import com.example.studentportal.repository.GradeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final CourseRepository courseRepository;
    private final GradeRepository gradeRepository;

    public DashboardController(CourseRepository courseRepository, GradeRepository gradeRepository) {
        this.courseRepository = courseRepository;
        this.gradeRepository = gradeRepository;
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getDashboardData(@PathVariable String userId) {
        log.info("Dashboard request for userId={}", userId);
        Map<String, Object> response = new HashMap<>();

        try {
            List<?> courses = courseRepository.findByUserId(userId);
            long courseCount = courses != null ? courses.size() : 0;

            List<Grade> grades = gradeRepository.findByUserId(userId);
            if (grades == null) {
                grades = new ArrayList<>();
            }

            Map<String, Double> subjectAverages = grades.stream()
                    .collect(Collectors.groupingBy(
                            Grade::getCourseName,
                            Collectors.averagingDouble(Grade::getScore)
                    ));

            double overallAverage = subjectAverages.values().stream()
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);

            response.put("courseCount", courseCount);
            response.put("overallAverage", overallAverage);
            response.put("subjectAverages", subjectAverages);

            log.debug("Dashboard built for userId={}, courseCount={}, overallAverage={}", userId, courseCount, overallAverage);

            return response;
        } catch (Exception e) {
            log.error("Error while building dashboard for userId={}", userId, e);
            response.put("error", "Серверде қате пайда болды");
            return response;
        }
    }
}