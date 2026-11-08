import api from "./axios";

export const getNotifications = () => api.get("/api/v1/users/me/notifications");
export const updateNotifications = (changes) => api.patch("/api/v1/users/me/notifications", changes);
export const saveNotificationEmail = (email) => api.put("/api/v1/users/me/notification-email", { email });

export const notificationErrorMessage = (error) =>
  error?.error?.email || error?.message || "알림 설정을 저장하지 못했어요. 다시 시도해주세요.";
