import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getMe } from "../../api/user";
import { hasStoredLogin } from "../../utils/auth";

function ProtectedRoute() {
  const [isLoggedIn] = useState(hasStoredLogin);
  // localStorage 값만으로는 만료 여부를 알 수 없어서 첫 진입 시 서버에 한 번 확인
  // 만료면 axios 인터셉터가 재발급을 시도하고, 실패하면 저장값을 지우고 로그인 화면으로 보냄
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;

    getMe()
      .then(() => !cancelled && setStatus("verified"))
      // 네트워크 오류 등 인증 외 실패는 그대로 통과시키고, 토큰이 지워졌으면(세션 만료) 로그인으로
      .catch(() => !cancelled && setStatus(hasStoredLogin() ? "verified" : "expired"));

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  if (!isLoggedIn || status === "expired") return <Navigate to="/auth/login" replace />;
  if (status === "checking") return null;
  return <Outlet />;
}

export default ProtectedRoute;
