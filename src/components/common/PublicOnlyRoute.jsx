import { Navigate, Outlet } from "react-router-dom";

import { hasStoredLogin } from "../../utils/auth";

// 로그인·회원가입처럼 비로그인 전용 화면. 이미 로그인했으면(뒤로가기 등) 홈으로
// 토큰이 만료된 경우는 홈의 ProtectedRoute가 확인 후 다시 로그인 화면으로 보냄
function PublicOnlyRoute() {
  return hasStoredLogin() ? <Navigate to="/home" replace /> : <Outlet />;
}

export default PublicOnlyRoute;
