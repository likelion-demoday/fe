import api from "./axios";

export const getMe = async () => {
  return api.get("/api/v1/users/me");
};

export const updateMe = async ({ nickname }) => {
  return api.patch("/api/v1/users/me", { nickname });
};
