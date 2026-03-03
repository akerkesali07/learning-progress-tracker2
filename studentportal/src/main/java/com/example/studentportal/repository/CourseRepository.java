package com.example.studentportal.repository;

import java.util.List;
import com.example.studentportal.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByUserId(String userId);
    List<Course> findByNameContainingIgnoreCase(String name);
    List<Course> findByTeacherContainingIgnoreCase(String teacher);
}