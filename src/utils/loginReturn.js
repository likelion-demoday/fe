const KEY = "resay:login-return";

// 메일에서 진입하는 내부 경로만 허용합니다. 외부 주소로는 이동하지 않습니다.
export const isLoginReturnPath = (path) => {
  if (typeof path !== "string") return false;
  return /^\/(?:home|mypage\/notifications|report\/[^/?#]+)(?:[?#].*)?$/.test(path);
};

export const rememberLoginReturn = (path) => {
  if (isLoginReturnPath(path)) sessionStorage.setItem(KEY, path);
};

export const consumeLoginReturn = () => {
  const path = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);
  return isLoginReturnPath(path) ? path : "/home";
};

export const loginPathFor = (path) =>
  isLoginReturnPath(path) ? `/auth/login?redirect=${encodeURIComponent(path)}` : "/auth/login";
