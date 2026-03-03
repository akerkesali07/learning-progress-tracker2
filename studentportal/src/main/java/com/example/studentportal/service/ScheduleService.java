package com.example.studentportal.service;

import com.example.studentportal.model.ScheduleEntry;
import com.example.studentportal.repository.ScheduleEntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    private final ScheduleEntryRepository repo;

    public ScheduleService(ScheduleEntryRepository repo) {
        this.repo = repo;
    }

    public List<ScheduleEntry> createAll(List<ScheduleEntry> entries) {
        return repo.saveAll(entries);
    }

    public ScheduleEntry update(String id, ScheduleEntry updated) {
        ScheduleEntry existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule entry not found"));
        existing.setStudentIds(updated.getStudentIds());
        existing.setDayOfWeek(updated.getDayOfWeek());
        existing.setLessonNumber(updated.getLessonNumber());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setCourseName(updated.getCourseName());
        existing.setRoom(updated.getRoom());
        existing.setTeacherName(updated.getTeacherName());
        return repo.save(existing);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    public List<ScheduleEntry> getForUser(String userId) {
        return repo.findByStudentIdsContaining(userId);
    }
}