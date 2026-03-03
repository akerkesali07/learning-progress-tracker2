package com.example.studentportal.controller;

import com.example.studentportal.exception.GlobalExceptionHandler;
import com.example.studentportal.model.Course;
import com.example.studentportal.model.Grade;
import com.example.studentportal.model.User;
import com.example.studentportal.repository.CourseRepository;
import com.example.studentportal.repository.GradeRepository;
import com.example.studentportal.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.example.studentportal.repository.TimetableRepository;
import com.example.studentportal.repository.TimetableRepository;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AdminController.class)
@Import(GlobalExceptionHandler.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private CourseRepository courseRepository;

    @MockBean
    private GradeRepository gradeRepository;

    @MockBean
        private TimetableRepository timetableRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllUsers_returnsList() throws Exception {
        User user = new User();
        user.setId("u1");
        user.setFullName("Test User");
        user.setEmail("test@example.com");

        given(userRepository.findAll()).willReturn(List.of(user));

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("u1")))
                .andExpect(jsonPath("$[0].fullName", is("Test User")))
                .andExpect(jsonPath("$[0].email", is("test@example.com")));
    }

    @Test
    void getAllCourses_returnsList() throws Exception {
        Course course = new Course();
        course.setId("c1");
        course.setName("Math");
        course.setTeacher("Teacher");

        given(courseRepository.findAll()).willReturn(List.of(course));

        mockMvc.perform(get("/api/admin/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("c1")))
                .andExpect(jsonPath("$[0].name", is("Math")))
                .andExpect(jsonPath("$[0].teacher", is("Teacher")));
    }

    @Test
    void addCourse_valid_returnsSavedCourse() throws Exception {
        Course course = new Course();
        course.setName("Math");
        course.setTeacher("Teacher");

        Course saved = new Course();
        saved.setId("c1");
        saved.setName("Math");
        saved.setTeacher("Teacher");

        given(courseRepository.save(any(Course.class))).willReturn(saved);

        mockMvc.perform(post("/api/admin/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(course)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is("c1")))
                .andExpect(jsonPath("$.name", is("Math")))
                .andExpect(jsonPath("$.teacher", is("Teacher")));
    }

    @Test
    void addCourse_missingName_returnsBadRequest() throws Exception {
        Course course = new Course();
        course.setName(" ");
        course.setTeacher("Teacher");

        mockMvc.perform(post("/api/admin/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(course)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Пән атауы толтырылмаған")));
    }

    @Test
    void addCourse_missingTeacher_returnsBadRequest() throws Exception {
        Course course = new Course();
        course.setName("Math");
        course.setTeacher(" ");

        mockMvc.perform(post("/api/admin/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(course)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Мұғалім аты толтырылмаған")));
    }

    @Test
    void addGrade_valid_returnsSavedGrade() throws Exception {
        Grade grade = new Grade();
        grade.setUserId("u1");
        grade.setCourseName("Math");
        grade.setScore(95);

        Grade saved = new Grade();
        saved.setId("g1");
        saved.setUserId("u1");
        saved.setCourseName("Math");
        saved.setScore(95);

        given(userRepository.existsById("u1")).willReturn(true);
        given(gradeRepository.save(any(Grade.class))).willReturn(saved);

        mockMvc.perform(post("/api/admin/grades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grade)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is("g1")))
                .andExpect(jsonPath("$.userId", is("u1")))
                .andExpect(jsonPath("$.courseName", is("Math")))
                .andExpect(jsonPath("$.score", is(95.0)));
    }

    @Test
    void addGrade_missingUserId_returnsBadRequest() throws Exception {
        Grade grade = new Grade();
        grade.setUserId(" ");
        grade.setCourseName("Math");
        grade.setScore(90);

        mockMvc.perform(post("/api/admin/grades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grade)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Студент таңдалмаған")));
    }

    @Test
    void addGrade_userNotFound_returnsBadRequest() throws Exception {
        Grade grade = new Grade();
        grade.setUserId("u1");
        grade.setCourseName("Math");
        grade.setScore(90);

        given(userRepository.existsById("u1")).willReturn(false);

        mockMvc.perform(post("/api/admin/grades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grade)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Студент табылмады")));
    }

    @Test
    void addGrade_invalidScore_returnsBadRequest() throws Exception {
        Grade grade = new Grade();
        grade.setUserId("u1");
        grade.setCourseName("Math");
        grade.setScore(150);

        given(userRepository.existsById("u1")).willReturn(true);

        mockMvc.perform(post("/api/admin/grades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(grade)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Баға 0-100 аралығында болуы керек")));
    }

    @Test
    void getAllGrades_returnsList() throws Exception {
        Grade grade = new Grade();
        grade.setId("g1");
        grade.setUserId("u1");
        grade.setCourseName("Math");
        grade.setScore(90);

        given(gradeRepository.findAll()).willReturn(List.of(grade));

        mockMvc.perform(get("/api/admin/grades"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("g1")))
                .andExpect(jsonPath("$[0].userId", is("u1")))
                .andExpect(jsonPath("$[0].courseName", is("Math")))
                .andExpect(jsonPath("$[0].score", is(90.0)));
    }

    @Test
    void deleteUser_callsRepository() throws Exception {
        mockMvc.perform(delete("/api/admin/users/{id}", "u1"))
                .andExpect(status().isOk());

        verify(userRepository, times(1)).deleteById("u1");
    }

    @Test
    void searchUsers_withoutQuery_returnsAll() throws Exception {
        User user = new User();
        user.setId("u1");
        user.setFullName("Test User");
        user.setEmail("test@example.com");

        given(userRepository.findAll()).willReturn(List.of(user));

        mockMvc.perform(get("/api/admin/users/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("u1")));
    }

    @Test
    void searchUsers_withQuery_returnsFiltered() throws Exception {
        User user = new User();
        user.setId("u1");
        user.setFullName("Test User");
        user.setEmail("test@example.com");

        given(userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase("test", "test"))
                .willReturn(List.of(user));

        mockMvc.perform(get("/api/admin/users/search")
                        .param("q", "test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("u1")))
                .andExpect(jsonPath("$[0].fullName", is("Test User")));
    }

    @Test
    void searchCourses_withoutQuery_returnsAll() throws Exception {
        Course course = new Course();
        course.setId("c1");
        course.setName("Math");
        course.setTeacher("Teacher");

        given(courseRepository.findAll()).willReturn(List.of(course));

        mockMvc.perform(get("/api/admin/courses/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("c1")));
    }

    @Test
    void searchCourses_withQuery_mergesNameAndTeacherWithoutDuplicates() throws Exception {
        Course byName = new Course();
        byName.setId("c1");
        byName.setName("Math");
        byName.setTeacher("Teacher A");

        Course byTeacher = new Course();
        byTeacher.setId("c2");
        byTeacher.setName("Physics");
        byTeacher.setTeacher("Teacher B");

        given(courseRepository.findByNameContainingIgnoreCase("mat"))
                .willReturn(List.of(byName));
        given(courseRepository.findByTeacherContainingIgnoreCase("mat"))
                .willReturn(Collections.emptyList());

        mockMvc.perform(get("/api/admin/courses/search")
                        .param("q", "mat"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("c1")));

        given(courseRepository.findByNameContainingIgnoreCase("teach"))
                .willReturn(Collections.emptyList());
        given(courseRepository.findByTeacherContainingIgnoreCase("teach"))
                .willReturn(List.of(byTeacher));

        mockMvc.perform(get("/api/admin/courses/search")
                        .param("q", "teach"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("c2")));
    }
}