import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import PurchaseHistory from "../../components/feature/mypage/PurchaseHistory";

const Recordings = ({ onConversations, onReports }) => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[36px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader title="녹음 • 기록" onBack={() => navigate("/mypage")} />
      <div className="flex flex-col gap-[12px]">
        <PurchaseHistory
          label="저장된 대화"
          to={onConversations ? undefined : "/mypage/recordings/conversations"}
          onClick={onConversations}
        />
        <PurchaseHistory label="보고서" onClick={onReports} />
      </div>
    </main>
  );
};

export default Recordings;
