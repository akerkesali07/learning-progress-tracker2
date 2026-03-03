package com.example.studentportal.controller;

import com.example.studentportal.model.Course;
import com.example.studentportal.model.Grade;
import com.example.studentportal.model.User;
import com.example.studentportal.repository.CourseRepository;
import com.example.studentportal.repository.GradeRepository;
import com.example.studentportal.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import com.example.studentportal.dto.TimetableSaveRequest;
import com.example.studentportal.dto.TimetableItemDto;
import com.example.studentportal.model.Timetable;
import com.example.studentportal.repository.TimetableRepository;
import java.util.*;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final GradeRepository gradeRepository;
    private final TimetableRepository timetableRepository;

    public AdminController(UserRepository userRepository,
                        CourseRepository courseRepository,
                        GradeRepository gradeRepository,
                        TimetableRepository timetableRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.gradeRepository = gradeRepository;
        this.timetableRepository = timetableRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        log.info("Admin: fetch all users");
        List<User> users = userRepository.findAll();
        log.debug("Admin: total users={}", users.size());
        return users;
    }

    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        log.info("Admin: fetch all courses");
        List<Course> courses = courseRepository.findAll();
        log.debug("Admin: total courses={}", courses.size());
        return courses;
    }

    @PostMapping("/courses")
    public Course addCourse(@RequestBody Course course) {
        log.info("Admin: add course name={}, teacher={}", course.getName(), course.getTeacher());

        if (course.getName() == null || course.getName().isBlank()) {
            throw new IllegalArgumentException("Пән атауы толтырылмаған");
        }
        if (course.getTeacher() == null || course.getTeacher().isBlank()) {
            throw new IllegalArgumentException("Мұғалім аты толтырылмаған");
        }

        Course saved = courseRepository.save(course);
        log.info("Admin: course created id={}", saved.getId());
        return saved;
    }

    @PostMapping("/grades")
    public Grade addGrade(@RequestBody Grade grade) {
        log.info("Admin: add grade userId={}, courseName={}, score={}",
                grade.getUserId(), grade.getCourseName(), grade.getScore());

        if (grade.getUserId() == null || grade.getUserId().isBlank()) {
            throw new IllegalArgumentException("Студент таңдалмаған");
        }
        if (!userRepository.existsById(grade.getUserId())) {
            throw new IllegalArgumentException("Студент табылмады");
        }
        if (grade.getCourseName() == null || grade.getCourseName().isBlank()) {
            throw new IllegalArgumentException("Пән атауы таңдалмаған");
        }
        if (grade.getScore() < 0 || grade.getScore() > 100) {
            throw new IllegalArgumentException("Баға 0-100 аралығында болуы керек");
        }

        Grade saved = gradeRepository.save(grade);
        log.info("Admin: grade created id={}", saved.getId());
        return saved;
    }

    @GetMapping("/grades")
    public List<Grade> getAllGrades() {
        log.info("Admin: fetch all grades");
        List<Grade> grades = gradeRepository.findAll();
        log.debug("Admin: total grades={}", grades.size());
        return grades;
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable String id) {
        log.warn("Admin: delete user id={}", id);
        userRepository.deleteById(id);
    }

    @GetMapping("/users/search")
    public List<User> searchUsers(@RequestParam(required = false, name = "q") String q) {
        log.info("Admin: search users q={}", q);
        if (q == null || q.isEmpty()) {
            List<User> all = userRepository.findAll();
            log.debug("Admin: search users empty query, total={}", all.size());
            return all;
        }
        List<User> result = userRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q);
        log.debug("Admin: search users result size={}", result.size());
        return result;
    }

    @GetMapping("/courses/search")
    public List<Course> searchCourses(@RequestParam(required = false, name = "q") String q) {
        log.info("Admin: search courses q={}", q);
        if (q == null || q.isEmpty()) {
            List<Course> all = courseRepository.findAll();
            log.debug("Admin: search courses empty query, total={}", all.size());
            return all;
        }

        List<Course> byName = courseRepository.findByNameContainingIgnoreCase(q);
        List<Course> byTeacher = courseRepository.findByTeacherContainingIgnoreCase(q);

        Set<String> ids = new HashSet<>();
        List<Course> result = new ArrayList<>();

        for (Course c : byName) {
            if (ids.add(c.getId())) {
                result.add(c);
            }
        }
        for (Course c : byTeacher) {
            if (ids.add(c.getId())) {
                result.add(c);
            }
        }

        log.debug("Admin: search courses result size={}", result.size());
        return result;
    }

    @PostMapping("/timetables")
    public void saveTimetables(@RequestBody TimetableSaveRequest request) {
        if (request == null || request.userIds() == null || request.userIds().isEmpty()) {
            throw new IllegalArgumentException("Кестені сақтау үшін кем дегенде бір студент таңдалуы керек");
        }

        int itemsSize = (request.items() == null) ? 0 : request.items().size();
        log.info(
                "Admin: save timetable for userIds={}, items={}",
                request.userIds().size(),
                itemsSize
        );

        for (String userId : request.userIds()) {
            timetableRepository.deleteByUserId(userId);
        }
        
        if (request.items() == null || request.items().isEmpty()) {
            log.info("Admin: timetable cleared for userIds={}", request.userIds().size());
            return;
        }

        List<Timetable> toSave = new ArrayList<>();
        for (String userId : request.userIds()) {
            for (TimetableItemDto item : request.items()) {
                Timetable t = new Timetable();
                t.setUserId(userId);
                t.setDay(item.day());
                t.setLessonNumber(item.lessonNumber());
                t.setCourseName(item.courseName());
                t.setRoom(item.room());
                t.setTime(item.time());
                t.setTeacher(item.teacher());
                toSave.add(t);
            }
        }

        timetableRepository.saveAll(toSave);
        log.info("Admin: timetable saved totalRecords={}", toSave.size());
    }

    @GetMapping("/timetables/{userId}")
    public List<Timetable> getTimetableForUser(@PathVariable String userId) {
        log.info("Admin: get timetable for userId={}", userId);
        return timetableRepository.findByUserId(userId);
    }

}