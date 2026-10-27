import api from "./axios";

export const getMyInfo = () => api.get("/api/v1/users/me");
export const updateMyInfo = (nickname) => api.patch("/api/v1/users/me", { nickname });
