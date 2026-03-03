package com.example.studentportal.controller;

import com.example.studentportal.model.Homework;
import com.example.studentportal.repository.HomeworkRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/homeworks")
@CrossOrigin(origins = "http://localhost:5173") // React үшін
public class HomeworkController {
    private final HomeworkRepository homeworkRepository;

    public HomeworkController(HomeworkRepository homeworkRepository) {
        this.homeworkRepository = homeworkRepository;
    }

    @GetMapping
    public List<Homework> getAllHomeworks() {
        return homeworkRepository.findAll();
    }
}
