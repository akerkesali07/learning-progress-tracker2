import api from "./axiosConfig";

export const registerUser = async (formData) => {
  const res = await api.post("/auth/register", formData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async ({ email, code, newPassword }) => {
  const res = await api.post("/auth/reset-password", { email, code, newPassword });
  return res.data;
};