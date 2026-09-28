import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import MyPageMenu from "../../components/feature/mypage/MyPageMenu";

const MyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/home", { replace: true });
  };

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[36px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader onBack={handleBack} />

      <MyPageMenu />
    </main>
  );
};

export default MyPage;
