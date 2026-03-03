package com.example.studentportal.service;

import com.example.studentportal.model.Homework;
import com.example.studentportal.repository.HomeworkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HomeworkService {
    private final HomeworkRepository repo;

    public HomeworkService(HomeworkRepository repo) {
        this.repo = repo;
    }

    public List<Homework> getAll() {
        return repo.findAll();
    }

    public Homework create(Homework hw) {
        return repo.save(hw);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
