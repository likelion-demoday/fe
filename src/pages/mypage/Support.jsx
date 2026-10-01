import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import PurchaseHistory from "../../components/feature/mypage/PurchaseHistory";

const Support = ({ onFaq, onContact, onNotices, onPolicies }) => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[36px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader title="고객지원" onBack={() => navigate("/mypage")} />
      <div className="flex flex-col gap-[12px]">
        <PurchaseHistory label="자주 묻는 질문" onClick={onFaq} />
        <PurchaseHistory label="문의하기" onClick={onContact} />
        <PurchaseHistory label="공지사항" onClick={onNotices} />
        <PurchaseHistory label="약관 및 정책" onClick={onPolicies} />
      </div>
    </main>
  );
};

export default Support;
