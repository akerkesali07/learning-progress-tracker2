import api from "./axiosConfig";

export const getTimetableForUser = async (userId) => {
  const res = await api.get(`/timetable/${userId}`);
  return res.data;
};