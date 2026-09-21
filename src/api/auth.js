import api from "./axios";

export const kakaoLogin = async (code) => {
  const response = await api.post("/api/v1/auth/oauth/kakao", {
    code,
    redirectUri: "http://localhost:5173/oauth/kakao/callback",
  });

  return response.data;
};
