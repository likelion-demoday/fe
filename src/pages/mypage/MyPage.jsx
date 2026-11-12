import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import MyPageMenu from "../../components/feature/mypage/MyPageMenu";

const MyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/home", { replace: true });
  };

  return (
    <main className="mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col gap-[36px] overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
      <MyPageHeader onBack={handleBack} />

      <MyPageMenu />
    </main>
  );
};

export default MyPage;
