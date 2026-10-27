import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import PurchaseHistory from "../../components/feature/mypage/PurchaseHistory";

const POLICIES = [
  { id: "terms", label: "서비스 이용 약관" },
  { id: "personal-information", label: "개인정보 수집 • 이용 동의" },
  { id: "voice-information", label: "음성정보 처리 동의" },
  { id: "privacy", label: "개인정보 처리방침" },
  { id: "payment-refund", label: "크레딧 결제 • 환불 정책" },
  { id: "recording-analysis", label: "녹음 및 Ai 분석 안내" },
];

const Policies = ({ onViewPolicy }) => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[30px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader
        title="약관 및 정책"
        titleClassName="text-heading"
        onBack={() => navigate("/mypage/support")}
      />
      <div className="flex flex-col gap-[12px]">
        {POLICIES.map(({ id, label }) => (
          <PurchaseHistory
            key={id}
            label={label}
            to={!onViewPolicy && ["terms", "personal-information"].includes(id) ? `/mypage/support/policies/${id}` : undefined}
            onClick={onViewPolicy ? () => onViewPolicy(id) : undefined}
          />
        ))}
      </div>
    </main>
  );
};

export default Policies;
