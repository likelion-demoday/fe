import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import NotificationSetting from "../../components/feature/mypage/NotificationSetting";
import { getMe, updateMarketingAgreement } from "../../api/user";

const notificationItems = [
  { id: "analysis", label: "분석 완료 알림" },
  { id: "service", label: "서비스 알림" },
  { id: "marketing", label: "마케팅 알림" },
];

const Notifications = () => {
  const navigate = useNavigate();
  // 분석·서비스 알림은 아직 전용 API가 없어 화면 내 상태로 관리합니다.
  const [settings, setSettings] = useState({
    analysis: false,
    service: false,
    marketing: false,
  });
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const savePending = useRef(false);

  useEffect(() => {
    let active = true;
    getMe().then((user) => {
      if (active) setUser(user);
    }).catch((error) => {
      if (active) setError(error?.message || "마케팅 알림 설정을 불러오지 못했어요.");
    });
    return () => { active = false; };
  }, [loadAttempt]);

  const changeMarketing = async (marketing) => {
    if (!user || savePending.current) return;
    savePending.current = true;
    setIsSaving(true);
    setError("");
    try {
      setUser(await updateMarketingAgreement(marketing));
    } catch (error) {
      setError(error?.message || "마케팅 알림 설정을 저장하지 못했어요. 다시 시도해주세요.");
    } finally {
      savePending.current = false;
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto h-[844px] w-[390px] overflow-y-auto bg-white">
      <div className="flex flex-col gap-[36px] px-[24px] py-[16px]">
        <MyPageHeader title="알림" onBack={() => navigate("/mypage")} />
        <div className="flex flex-col gap-[12px]">
          {!user && !error && <p role="status">마케팅 알림 설정을 불러오는 중...</p>}
          {error && <p role="alert" className="text-body text-[#595959]">{error}</p>}
          {!user && error && <button type="button" onClick={() => {
            setError("");
            setLoadAttempt((value) => value + 1);
          }}>다시 시도</button>}
          {notificationItems.map(({ id, label }) => (
            <NotificationSetting
              key={id}
              label={label}
              checked={id === "marketing" ? Boolean(user?.marketingAgreed) : settings[id]}
              disabled={id === "marketing" && (!user || isSaving)}
              onChange={(checked) =>
                id === "marketing" ? changeMarketing(checked) :
                  setSettings((previous) => ({ ...previous, [id]: checked }))
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Notifications;
