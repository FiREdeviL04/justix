import api from "./api";

export const fetchLawyers = async (params = {}) => {
  const { data } = await api.get("/lawyers", { params });
  return data;
};

export const fetchLawyerProfile = async (lawyerId) => {
  const { data } = await api.get(`/lawyers/${lawyerId}`);
  return data;
};

export const createBookingInquiry = async (payload) => {
  const { data } = await api.post("/inquiry", payload);
  return data;
};
