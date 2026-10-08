import api from "./axios";

export const getAnalysisSummary = async () => {
  return api.get("/api/v1/analyses/summary");
};

export const getAnalysisReport = async (recordingId) => {
  return api.get(`/api/v1/analyses/${recordingId}`);
}