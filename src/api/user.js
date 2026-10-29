import api from "./axios";

export const getMe = async () => {
  return api.get("/api/v1/users/me");
};

export const updateMe = async ({ nickname }) => {
  return api.patch("/api/v1/users/me", { nickname });
};

// 마이페이지(Profile)에서 사용. getMe·updateMe와 같은 API
export const getMyInfo = () => api.get("/api/v1/users/me");
export const updateMyInfo = (nickname) => api.patch("/api/v1/users/me", { nickname });
