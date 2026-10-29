import api from "./axios";

export const googleLogin = async (idToken) => {
  return api.post("/api/v1/auth/oauth/google", { idToken });
};

export const kakaoLogin = async (code) => {
  return api.post("/api/v1/auth/oauth/kakao", {
    code,
    redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
  });
};

// agreements: { terms, privacy, voice, marketing }
export const signUp = async ({ email, password, nickname, agreements }) => {
  return api.post("/api/v1/auth/signup", { email, password, nickname, agreements });
};

// 소셜 첫 로그인(isNewUser) 후 가입. registerToken은 30분 유효·1회용, 만료 시 AUTH401_4
export const oauthSignUp = async ({ registerToken, nickname, agreements }) => {
  return api.post("/api/v1/auth/oauth/signup", { registerToken, nickname, agreements });
};

export const login = async ({ email, password }) => {
  return api.post("/api/v1/auth/login", { email, password });
};

export const logout = async (refreshToken) => {
  return api.post("/api/v1/auth/logout", { refreshToken });
};

export const reissueToken = async (refreshToken) => {
  return api.post("/api/v1/auth/reissue", { refreshToken });
};
