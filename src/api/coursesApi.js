import api from "./axiosConfig";

export const getCoursesByUser = async (userId) => {
  const res = await api.get(`/courses/user/${userId}`);
  return res.data;
};