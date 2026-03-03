package com.example.studentportal.dto;

import java.util.List;

public record TimetableSaveRequest(
        List<String> userIds,
        List<TimetableItemDto> items
) {
}