import axios from "axios";

import api from "./axios";

export const createShareLink = (recordingId) => {
  return api.post(`/api/v1/analyses/${recordingId}/shares`);
};

// 공개 조회는 로그인 토큰(Bearer)·재발급 인터셉터가 붙지 않도록 별도 인스턴스 사용
const publicApi = axios.create({
  baseURL: import.meta.env.DEV ? "" : import.meta.env.VITE_API_BASE_URL,
});

const shareHeaders = (token) => ({ Authorization: `Share ${token}` });

export const getSharedReport = async (token) => {
  const { data } = await publicApi.get("/api/v1/shared/analysis-report", {
    headers: shareHeaders(token),
  });
  return data.result;
};

export const getSharedCharacterImage = async (token, speakerRole) => {
  const { data } = await publicApi.get("/api/v1/shared/character-image", {
    headers: shareHeaders(token),
    params: { speakerRole },
    responseType: "blob",
  });
  return data;
};
