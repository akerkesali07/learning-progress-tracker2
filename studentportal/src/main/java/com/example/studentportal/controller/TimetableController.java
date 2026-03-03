package com.example.studentportal.controller;

import com.example.studentportal.model.Timetable;
import com.example.studentportal.repository.TimetableRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "http://localhost:5173")
public class TimetableController {

    private final TimetableRepository timetableRepository;

    public TimetableController(TimetableRepository timetableRepository) {
        this.timetableRepository = timetableRepository;
    }

    @GetMapping("/{userId}")
    public List<Timetable> getUserTimetable(@PathVariable String userId) {
        log.info("Timetable: get for userId={}", userId);
        return timetableRepository.findByUserId(userId);
    }
}