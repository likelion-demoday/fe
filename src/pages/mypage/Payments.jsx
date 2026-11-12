import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCredits } from "../../api/credit";
import { clearChargeReturn, getChargeReturn } from "../../utils/chargeReturn";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import RemainingPasses from "../../components/feature/mypage/RemainingPasses";
import PurchaseHistory from "../../components/feature/mypage/PurchaseHistory";

const Payments = ({ onHistory, onPurchase }) => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMyCredits()
      .then((credits) => {
        if (active) setBalance(credits.balance);
      })
      .catch((error) => {
        if (active) setError(error?.message || "크레딧을 불러오지 못했어요.");
      });
    return () => { active = false; };
  }, []);

  // 보고서·분석 결제 시트에서 충전하러 온 경우엔 그 화면으로 돌아감 (충전을 그만둔 것이므로 저장값도 지움)
  const handleBack = () => {
    const chargeReturn = getChargeReturn();
    if (chargeReturn) {
      clearChargeReturn();
      navigate(chargeReturn.path, { replace: true, state: chargeReturn.state });
    } else {
      navigate("/mypage");
    }
  };

  return (
    <main className="mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col gap-[30px] overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
      <MyPageHeader title="이용권 • 결제" onBack={handleBack} />
      <div className="flex flex-col gap-[12px]">
        {error ? <p role="alert" className="text-body py-[12px] text-[#595959]">{error}</p>
          : balance === null ? <p role="status" className="text-body py-[12px] text-[#595959]">크레딧을 불러오는 중...</p>
          : <RemainingPasses balance={balance} />}
        <PurchaseHistory
          to={onHistory ? undefined : "/mypage/payments/history"}
          onClick={onHistory}
        />
        <PurchaseHistory
          label="크레딧 충전"
          to={onPurchase ? undefined : "/payments"}
          onClick={onPurchase}
        />
      </div>
    </main>
  );
};

export default Payments;
