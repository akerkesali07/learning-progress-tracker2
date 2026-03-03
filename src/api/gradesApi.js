import api from "./axiosConfig";

export const getGrades = async () => {
  const res = await api.get("/grades");
  return res.data;
};

export const getTranscript = async (userId) => {
  const res = await api.get(`/grades/transcript/${userId}`);
  return res.data;
};

export const getAverageGrade = async (userId) => {
  const res = await api.get(`/grades/average/${userId}`);
  return res.data;
};