import api from "./axios";

export const getAnalyses = ({ page = 0, size = 10 } = {}) => {
  return api.get("/api/v1/analyses", { params: { page, size } });
};

export const getAnalysisSummary = async () => {
  return api.get("/api/v1/analyses/summary");
};
