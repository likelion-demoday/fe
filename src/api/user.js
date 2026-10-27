import api from "./axios";

export const getMyInfo = () => api.get("/api/v1/users/me");
