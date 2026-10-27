import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import PurchaseHistory from "../../components/feature/mypage/PurchaseHistory";
import LogoutSheet from "../../components/feature/mypage/LogoutSheet";
import WithdrawSheet from "../../components/feature/mypage/WithdrawSheet";

const Account = ({ onLoginInfo, onPrivacy }) => {
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const logoutPending = useRef(false);
  const closeSheet = () => {
    if (logoutPending.current) return;
    setActiveSheet(null);
    setLogoutError("");
  };

  const handleLogout = async () => {
    if (logoutPending.current) return;
    logoutPending.current = true;
    setIsLoggingOut(true);
    setLogoutError("");
    try {
      await logout(localStorage.getItem("refreshToken"));
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLogin");
      navigate("/auth/login", { replace: true });
    } catch (error) {
      setLogoutError(error?.message || "로그아웃하지 못했어요. 다시 시도해주세요.");
    } finally {
      logoutPending.current = false;
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="relative mx-auto flex h-[844px] w-[390px] flex-col gap-[36px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader title="계정" onBack={() => navigate("/mypage")} />
      <div className="flex flex-col gap-[12px]">
        <PurchaseHistory label="로그인 정보" onClick={onLoginInfo} />
        <PurchaseHistory label="개인정보 및 동의" onClick={onPrivacy} />
        <PurchaseHistory label="로그아웃" onClick={() => setActiveSheet("logout")} />
        <PurchaseHistory label="회원 탈퇴" onClick={() => setActiveSheet("withdraw")} />
      </div>
      {activeSheet === "logout" && (
        <LogoutSheet onClose={closeSheet} onLogout={handleLogout} isLoggingOut={isLoggingOut} error={logoutError} />
      )}
      {activeSheet === "withdraw" && (
        <WithdrawSheet onClose={closeSheet} onContact={() => {
          closeSheet();
          navigate("/mypage/support/contact");
        }} />
      )}
    </main>
  );
};

export default Account;
