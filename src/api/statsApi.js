import api from "./axiosConfig";

export const getStats = async (userId) => {
  const res = await api.get(`/stats/${userId}`);
  return res.data;
};