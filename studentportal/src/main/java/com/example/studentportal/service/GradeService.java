package com.example.studentportal.service;

import com.example.studentportal.model.Grade;
import com.example.studentportal.repository.GradeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {
    private final GradeRepository repo;

    public GradeService(GradeRepository repo) {
        this.repo = repo;
    }

    public List<Grade> getAll() {
        return repo.findAll();
    }

    public Grade create(Grade grade) {
        return repo.save(grade);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
