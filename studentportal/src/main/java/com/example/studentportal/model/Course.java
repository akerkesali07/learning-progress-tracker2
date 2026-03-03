package com.example.studentportal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String name;
    private String teacher;
    private String userId;
}

