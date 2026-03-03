package com.example.studentportal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "timetables")
public class Timetable {
    @Id
    private String id;
    private String userId;
    private String day;
    private int lessonNumber;
    private String courseName;
    private String room;
    private String time;
    private String teacher;
}