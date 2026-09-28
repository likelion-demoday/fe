import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isSessionExpiredHandled = false;
let reissuePromise = null;

const reissue = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const { data } = await axios.post(`${BASE_URL}/api/v1/auth/reissue`, {
    refreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken } = data.result;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", newRefreshToken);
  return accessToken;
};

const handleSessionExpired = () => {
  if (isSessionExpiredHandled) {
    return;
  }

  isSessionExpiredHandled = true;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isLogin");

  alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
  window.location.href = "/login";
};

api.interceptors.response.use(
  (response) => {
    const { isSuccess, code, message, result, error } = response.data;

    if (isSuccess) {
      return result;
    }

    return Promise.reject({ code, message, error });
  },
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;

    if (code === "COMMON401_2" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!reissuePromise) {
          reissuePromise = reissue().finally(() => {
            reissuePromise = null;
          });
        }
        await reissuePromise;
        return api(originalRequest);
      } catch (reissueError) {
        handleSessionExpired();
        return Promise.reject({
          code: reissueError.response?.data?.code,
          message: "로그인이 만료되었습니다.",
        });
      }
    }

    if (code === "COMMON401_1") {
      handleSessionExpired();
    }

    return Promise.reject({
      code,
      message:
        error.response?.data?.message || "서버와 통신 중 오류가 발생했습니다.",
      error: error.response?.data?.error,
    });
  },
);

export default api;
