import api from "./axiosConfig";

export const getHomeworks = async () => {
  const res = await api.get("/homeworks");
  return res.data;
};