import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo, updateMyInfo } from "../../api/user";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import ProfileInfo from "../../components/feature/mypage/ProfileInfo";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getMyInfo()
      .then((user) => {
        if (active) setProfile(user);
      })
      .catch((error) => {
        if (active) setError(error?.message || "프로필을 불러오지 못했어요.");
      });
    return () => { active = false; };
  }, [attempt]);

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[36px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader title="프로필" onBack={() => navigate("/mypage")} />
      {error ? (
        <div className="flex flex-col items-start gap-[12px]">
          <p role="alert" className="text-body text-[#595959]">{error}</p>
          <button type="button" className="text-body cursor-pointer" onClick={() => {
            setError("");
            setAttempt((value) => value + 1);
          }}>다시 시도</button>
        </div>
      ) : profile === null ? (
        <p role="status" className="text-body text-[#595959]">프로필을 불러오는 중...</p>
      ) : <ProfileInfo {...profile} onSaveNickname={async (nickname) => {
        const updatedProfile = await updateMyInfo(nickname);
        setProfile(updatedProfile);
      }} />}
    </main>
  );
};
export default Profile;
