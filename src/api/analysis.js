import api from "./axios";

export const getAnalysisSummary = async () => {
  return api.get("/api/v1/analyses/summary");
};