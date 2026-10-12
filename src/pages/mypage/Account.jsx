import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import PurchaseHistory from "../../components/feature/mypage/PurchaseHistory";
import LogoutSheet from "../../components/feature/mypage/LogoutSheet";
import WithdrawSheet from "../../components/feature/mypage/WithdrawSheet";

const Account = ({ onLoginInfo, onPrivacy, onLogout, onWithdraw }) => {
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState(null);
  const closeSheet = () => setActiveSheet(null);

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
        <LogoutSheet onClose={closeSheet} onLogout={onLogout} />
      )}
      {activeSheet === "withdraw" && (
        <WithdrawSheet onClose={closeSheet} onWithdraw={onWithdraw} />
      )}
    </main>
  );
};

export default Account;
