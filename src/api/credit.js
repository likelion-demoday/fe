import api from "./axios";

export const getMyCredits = async () => {
  return api.get("/api/v1/credits/me");
};

export const getCreditPrices = async () => {
  return api.get("/api/v1/credits/prices");
};

export const getCreditHistory = ({ page = 0, size = 20 } = {}) => {
  return api.get("/api/v1/credits/history", { params: { page, size } });
};
