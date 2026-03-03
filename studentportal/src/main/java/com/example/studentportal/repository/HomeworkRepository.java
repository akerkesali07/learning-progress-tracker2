package com.example.studentportal.repository;

import com.example.studentportal.model.Homework;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HomeworkRepository extends MongoRepository<Homework, String> {
    List<Homework> findByUserId(String userId);
    List<Homework> findByUserIdAndCompleted(String userId, boolean completed);
}