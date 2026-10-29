// localStorage 기준 로그인 여부 (만료 여부는 서버 확인 필요)
export const hasStoredLogin = () => {
  const accessToken = localStorage.getItem("accessToken");
  return (
    localStorage.getItem("isLogin") === "true" &&
    Boolean(accessToken) &&
    accessToken !== "undefined" &&
    accessToken !== "null"
  );
};
