package com.example.studentportal.service;

import com.example.studentportal.model.Course;
import com.example.studentportal.repository.CourseRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseService {
    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    public List<Course> getAll() {
        return repo.findAll();
    }

    public Course create(Course course) {
        return repo.save(course);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    public List<Course> getCoursesByUser(String userId) {
        return repo.findByUserId(userId);
    }

    public long getCourseCount(String userId) {
        return repo.findByUserId(userId).size();
    }

    public Course update(String id, Course updated) {
        Course existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        existing.setName(updated.getName());
        existing.setTeacher(updated.getTeacher());
        existing.setUserId(updated.getUserId());
        return repo.save(existing);
    }
}