import api from "./axios";

// TODO: 백엔드 구글 로그인 API 경로 및 요청 형식 확인
export const googleLogin = async (code) => {
  return api.post("/api/v1/auth/oauth/google", {
    code,
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  });
};

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
