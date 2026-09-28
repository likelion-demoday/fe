import api from "./axios";

export const kakaoLogin = async (code) => {
  return api.post("/api/v1/auth/oauth/kakao", {
    code,
    redirectUri: "http://localhost:5173/oauth/kakao/callback",
  });
};

export const signUp = async ({ email, password, nickname }) => {
  return api.post("/api/v1/auth/signup", { email, password, nickname });
};

export const login = async ({ email, password }) => {
  return api.post("/api/v1/auth/login", { email, password });
};

export const logout = async (refreshToken) => {
  return api.post("/api/v1/auth/logout",{refreshToken});
};

export const reissueToken = async (refreshToken) => {
  return api.post("/api/v1/auth/reissue", { refreshToken });
};
