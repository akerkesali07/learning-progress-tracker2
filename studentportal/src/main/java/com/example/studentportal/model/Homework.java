package com.example.studentportal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "homeworks")
public class Homework {
    @Id
    private String id;
    private String subject;
    private String title;
    private String dueDate;
    private String status;
    private String userId;
    private boolean completed;
    private int studyMinutes;
    private String studyDate;
}