package com.example.studentportal.dto;

public record TimetableItemDto(
        String day,
        int lessonNumber,
        String courseName,
        String room,
        String time,
        String teacher
) {
}