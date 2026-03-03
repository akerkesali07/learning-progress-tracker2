package com.example.studentportal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "schedule_entries")
public class ScheduleEntry {
    @Id
    private String id;
    private List<String> studentIds;
    private String dayOfWeek;
    private int lessonNumber;
    private String startTime;
    private String endTime;
    private String courseName;
    private String room;
    private String teacherName;
}