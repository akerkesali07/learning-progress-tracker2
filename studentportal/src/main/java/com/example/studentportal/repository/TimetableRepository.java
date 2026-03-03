package com.example.studentportal.repository;

import com.example.studentportal.model.Timetable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TimetableRepository extends MongoRepository<Timetable, String> {
    List<Timetable> findByUserId(String userId);
    void deleteByUserId(String userId);
}