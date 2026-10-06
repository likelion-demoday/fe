import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import RemainingPasses from "../../components/feature/mypage/RemainingPasses";
import PurchaseHistory from "../../components/feature/mypage/PurchaseHistory";

const Payments = ({ remainingPasses = 3, onHistory, onPurchase }) => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[36px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader title="이용권 • 결제" onBack={() => navigate("/mypage")} />
      <div className="flex flex-col gap-[12px]">
        <RemainingPasses count={remainingPasses} />
        <PurchaseHistory
          to={onHistory ? undefined : "/mypage/payments/history"}
          onClick={onHistory}
        />
        <PurchaseHistory
          label="이용권 구매하기"
          to={onPurchase ? undefined : "/payments"}
          onClick={onPurchase}
        />
      </div>
    </main>
  );
};

export default Payments;
