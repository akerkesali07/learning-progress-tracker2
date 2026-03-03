import api from "./axiosConfig";

export const getUserProfile = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const updateUserProfile = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};