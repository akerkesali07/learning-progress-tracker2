package com.example.studentportal.controller;

import com.example.studentportal.model.Course;
import com.example.studentportal.service.CourseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/courses")
@Slf4j
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Course> getAll() {
        log.info("Fetch all courses");
        return service.getAll();
    }

    @PostMapping
    public Course create(@RequestBody Course course) {
        log.info("Create course name={}, teacher={}", course.getName(), course.getTeacher());
        return service.create(course);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        log.warn("Delete course id={}", id);
        service.delete(id);
    }

    @GetMapping("/user/{userId}")
    public List<Course> getCoursesByUser(@PathVariable String userId) {
        log.info("Fetch courses by userId={}", userId);
        return service.getCoursesByUser(userId);
    }

    @GetMapping("/count/{userId}")
    public long getCourseCount(@PathVariable String userId) {
        return service.getCourseCount(userId);
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable String id, @RequestBody Course updated) {
        log.info("Update course id={}", id);
        return service.update(id, updated);
    }
}