package com.example.studentportal.controller;

import com.example.studentportal.model.Homework;
import com.example.studentportal.repository.HomeworkRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {

    private final HomeworkRepository homeworkRepository;

    private boolean isHomeworkDone(Homework hw) {
        if (hw.isCompleted()) return true;
        String st = hw.getStatus();
        return st != null && st.equalsIgnoreCase("DONE");
    }

    public StatsController(HomeworkRepository homeworkRepository) {
        this.homeworkRepository = homeworkRepository;
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getStats(@PathVariable String userId) {
        Map<String, Object> result = new HashMap<>();

        List<Homework> homeworks = homeworkRepository.findByUserId(userId);
        if (homeworks == null) {
            homeworks = new ArrayList<>();
        }

        long completedCount = homeworks.stream()
                .filter(this::isHomeworkDone)
                .count();

        int totalMinutes = (int) completedCount * 60;
        double totalHours = totalMinutes / 60.0;

        Map<String, Map<String, Object>> daily = new HashMap<>();

        for (Homework hw : homeworks) {
            String date = hw.getStudyDate();
            if (date == null || date.isEmpty()) {
                date = hw.getDueDate();
            }
            if (date == null || date.isEmpty()) {
                continue;
            }

            Map<String, Object> day = daily.getOrDefault(date, new HashMap<>());
            int dayMinutes = ((Number) day.getOrDefault("studyMinutes", 0)).intValue();
            int dayCompleted = ((Number) day.getOrDefault("completedCount", 0)).intValue();

            boolean done = isHomeworkDone(hw);

            int newMinutes = dayMinutes + (done ? 60 : 0);
            int newCompleted = dayCompleted + (done ? 1 : 0);

            day.put("studyMinutes", newMinutes);
            day.put("completedCount", newCompleted);
            daily.put(date, day);
        }

        result.put("completedHomeworks", completedCount);
        result.put("totalStudyMinutes", totalMinutes);
        result.put("totalStudyHours", totalHours);
        result.put("daily", daily);

        return result;
    }
}