import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCredits } from "../../api/credit";
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

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[30px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader title="이용권 • 결제" onBack={() => navigate("/mypage")} />
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
