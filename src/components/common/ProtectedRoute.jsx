import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn =
    localStorage.getItem("isLogin") === "true" &&
    Boolean(accessToken) &&
    accessToken !== "undefined" &&
    accessToken !== "null";

  return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" replace />;
}

export default ProtectedRoute;
