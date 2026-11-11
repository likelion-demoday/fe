import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import NotificationSetting from "../../components/feature/mypage/NotificationSetting";
import chevronRightIcon from "../../assets/icons/mypage-chevron-right.svg";
import { getNotifications, updateNotifications, saveNotificationEmail, notificationErrorMessage } from "../../api/notifications";
import { isValidEmail } from "../../utils/validation";
import { getMe } from "../../api/user";

const notificationItems = [
  { id: "analysis", label: "분석 완료 알림" },
  { id: "service", label: "서비스 알림" },
  { id: "marketing", label: "마케팅 알림" },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const savePending = useRef(false);
  const trimmedEmail = email.trim();
  const validEmail = !trimmedEmail || (trimmedEmail.length <= 100 && isValidEmail(trimmedEmail));

  useEffect(() => {
    let active = true;
    Promise.all([getNotifications(), getMe()]).then(([result, user]) => {
      if (!active) return;
      setSettings(result);
      setEmail(result.email ?? user.email ?? "");
    }).catch((error) => {
      if (active) setError(notificationErrorMessage(error));
    });
    return () => { active = false; };
  }, [loadAttempt]);

  const save = async (operation) => {
    if (!settings || savePending.current) return;
    savePending.current = true;
    setIsSaving(true);
    setError("");
    setNotice("");
    try { await operation(); }
    catch (error) { setError(notificationErrorMessage(error)); }
    finally { savePending.current = false; setIsSaving(false); }
  };

  const changeSetting = (id, checked) => save(async () => {
    let current = settings;
    if (checked && (!current.email || trimmedEmail !== current.email)) {
      if (!trimmedEmail || !validEmail) {
        setError("알림을 받을 이메일을 먼저 입력해 주세요.");
        return;
      }
      // 이메일 등록과 알림 활성화는 반드시 PUT → PATCH 순서로 처리합니다.
      current = await saveNotificationEmail(trimmedEmail);
      setSettings(current);
      setEmail(current.email ?? "");
    }
    const result = await updateNotifications({ [id]: checked });
    setSettings(result);
    setNotice("알림 설정을 저장했어요.");
  });

  return (
    <main className="mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-y-auto bg-white">
      <div className="flex flex-col gap-[30px] px-[24px] py-[16px]">
        <MyPageHeader title="알림" onBack={() => navigate("/mypage")} />
        {!settings && !error && <p role="status">알림 설정을 불러오는 중...</p>}
        {error && <p role="alert" className="text-body text-[#595959]">{error}</p>}
        {!settings && error && <button type="button" onClick={() => { setError(""); setLoadAttempt((value) => value + 1); }}>다시 시도</button>}
        {settings && <>
          <div className="flex flex-col gap-[12px]">
            <Link to="/mypage/notifications/email" className="mypage-press-row flex w-full items-center justify-between py-[12px] text-label text-[#262626]">
              <span>알림 받을 이메일</span>
              <img src={chevronRightIcon} alt="" className="shrink-0" />
            </Link>
            {notificationItems.map(({ id, label }) => <NotificationSetting key={id} label={label} checked={Boolean(settings[id])} disabled={isSaving || !settings.email} onChange={(checked) => changeSetting(id, checked)} />)}
          </div>
          {!settings.email && <p className="text-caption text-[#8c8c8c]">알림을 받으려면 이메일을 먼저 등록해 주세요.</p>}
          {notice && <p role="status" className="text-caption text-[#595959]">{notice}</p>}
        </>}
      </div>
    </main>
  );
};

export default Notifications;
