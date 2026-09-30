import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import NotificationSetting from "../../components/feature/mypage/NotificationSetting";

const notificationItems = [
  { id: "analysis", label: "분석 완료 알림" },
  { id: "service", label: "서비스 알림" },
  { id: "marketing", label: "마케팅 알림" },
];

const Notifications = () => {
  const navigate = useNavigate();
  // API 연결 전이라 Figma 임시로 다 false 해둠
  const [settings, setSettings] = useState({
    analysis: false,
    service: false,
    marketing: false,
  });

  return (
    <main className="mx-auto h-[844px] w-[390px] overflow-y-auto bg-white">
      <div className="flex flex-col gap-[36px] px-[24px] py-[16px]">
        <MyPageHeader title="알림" onBack={() => navigate("/mypage")} />
        <div className="flex flex-col gap-[12px]">
          {notificationItems.map(({ id, label }) => (
            <NotificationSetting
              key={id}
              label={label}
              checked={settings[id]}
              onChange={(checked) =>
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
