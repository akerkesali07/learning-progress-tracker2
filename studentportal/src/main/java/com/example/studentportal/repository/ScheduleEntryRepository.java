package com.example.studentportal.repository;

import com.example.studentportal.model.ScheduleEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ScheduleEntryRepository extends MongoRepository<ScheduleEntry, String> {
    List<ScheduleEntry> findByStudentIdsContaining(String studentId);
}