import api from "./axiosConfig";

export const getAdminUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const searchUsers = async (q) => {
  const res = await api.get("/admin/users/search", { params: { q } });
  return res.data;
};

export const getAdminCourses = async () => {
  const res = await api.get("/admin/courses");
  return res.data;
};

export const searchCourses = async (q) => {
  const res = await api.get("/admin/courses/search", { params: { q } });
  return res.data;
};

export const addAdminCourse = async (course) => {
  const res = await api.post("/admin/courses", course);
  return res.data;
};

export const updateAdminCourse = async (id, body) => {
  const res = await api.put(`/courses/${id}`, body);
  return res.data;
};

export const deleteAdminCourse = async (id) => {
  await api.delete(`/courses/${id}`);
};

export const getCoursesByUserAdmin = async (userId) => {
  const res = await api.get(`/admin/users/${userId}/courses`);
  return res.data;
};

export const assignCourseToUser = async (userId, courseId) => {
  const res = await api.post(`/admin/users/${userId}/courses/${courseId}`);
  return res.data;
};

export const removeCourseFromUser = async (userId, courseId) => {
  await api.delete(`/admin/users/${userId}/courses/${courseId}`);
};

export const getAdminGrades = async () => {
  const res = await api.get("/admin/grades");
  return res.data;
};

export const addAdminGrade = async (grade) => {
  const res = await api.post("/admin/grades", grade);
  return res.data;
};

export const updateAdminGrade = async (id, body) => {
  const res = await api.put(`/grades/${id}`, body);
  return res.data;
};

export const deleteAdminGrade = async (id) => {
  await api.delete(`/grades/${id}`);
};

export const getAdminHomeworksByUser = async (userId) => {
  const res = await api.get("/admin/homeworks", { params: { userId } });
  return res.data;
};

export const addAdminHomework = async (hw) => {
  const res = await api.post("/admin/homeworks", hw);
  return res.data;
};

export const updateAdminHomework = async (id, hw) => {
  const res = await api.put(`/admin/homeworks/${id}`, hw);
  return res.data;
};

export const deleteAdminHomework = async (id) => {
  await api.delete(`/admin/homeworks/${id}`);
};

export const saveTimetable = async (payload) => {
  await api.post("/admin/timetables", payload);
};

export const getTimetableForUserAdmin = async (userId) => {
  const res = await api.get(`/admin/timetables/${userId}`);
  return res.data;
};

export const clearTimetableForUser = async (userId) => {
  await saveTimetable({ userIds: [userId], items: [] });
};