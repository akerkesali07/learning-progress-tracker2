package com.example.studentportal.repository;

import com.example.studentportal.model.Grade;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GradeRepository extends MongoRepository<Grade, String> {
    List<Grade> findByUserId(String userId);
}
