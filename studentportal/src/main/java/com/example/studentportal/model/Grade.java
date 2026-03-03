package com.example.studentportal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "grades")
public class Grade {
    @Id
    private String id;
    private String userId;      // студент ID  // пән ID (егер қажет болса)
    private String courseName;  // пәннің атауы (Dashboard үшін)
    private String task;        // тапсырма атауы
    private double score;       // баға (grade орнына)
    private String date;        // бағалау күні

    // егер бұрын деректерде "grade" деп сақталып кеткен болса,
    // онда қосымша әдіс қалдырған дұрыс:
    public void setGrade(int grade) {
        this.score = grade;
    }
}
