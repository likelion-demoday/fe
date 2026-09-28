import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import ProfileInfo from "../../components/feature/mypage/ProfileInfo";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[36px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader title="프로필" onBack={() => navigate("/mypage")} />
      <ProfileInfo />
    </main>
  );
};
export default Profile;
