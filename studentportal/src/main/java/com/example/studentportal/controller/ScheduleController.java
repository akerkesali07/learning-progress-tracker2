package com.example.studentportal.controller;

import com.example.studentportal.model.ScheduleEntry;
import com.example.studentportal.service.ScheduleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "http://localhost:5173")
public class ScheduleController {

    private final ScheduleService service;

    public ScheduleController(ScheduleService service) {
        this.service = service;
    }

    @PostMapping("/admin/bulk")
    public List<ScheduleEntry> createBulk(@RequestBody List<ScheduleEntry> entries) {
        return service.createAll(entries);
    }

    @PutMapping("/admin/{id}")
    public ScheduleEntry update(@PathVariable String id, @RequestBody ScheduleEntry entry) {
        return service.update(id, entry);
    }

    @DeleteMapping("/admin/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @GetMapping("/user/{userId}")
    public List<ScheduleEntry> getForUser(@PathVariable String userId) {
        return service.getForUser(userId);
    }
}