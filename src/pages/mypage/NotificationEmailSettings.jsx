import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import EmailInput from "../../components/feature/auth/EmailInput";
import Button from "../../components/common/Button";
import { getNotifications, saveNotificationEmail, notificationErrorMessage } from "../../api/notifications";
import { getMe } from "../../api/user";
import { isValidEmail } from "../../utils/validation";

const NotificationEmailSettings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const pending = useRef(false);
  const trimmedEmail = email.trim();
  const validEmail = !trimmedEmail || (trimmedEmail.length <= 100 && isValidEmail(trimmedEmail));
  const goBack = () => navigate("/mypage/notifications");

  useEffect(() => {
    let active = true;
    Promise.all([getNotifications(), getMe()]).then(([settings, user]) => {
      if (!active) return;
      setEmail(settings.email ?? user.email ?? "");
      setLoading(false);
    }).catch((error) => {
      if (active) { setError(notificationErrorMessage(error)); setLoading(false); }
    });
    return () => { active = false; };
  }, [loadAttempt]);

  const submit = async (event) => {
    event.preventDefault();
    if (loading || !validEmail || pending.current || error) return;
    pending.current = true;
    setIsSaving(true);
    try {
      await saveNotificationEmail(trimmedEmail);
      navigate("/mypage/notifications", { replace: true });
    } catch (error) {
      setError(notificationErrorMessage(error));
    } finally { pending.current = false; setIsSaving(false); }
  };

  return (
    <form onSubmit={submit} noValidate className="mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col bg-white">
      <div className="flex min-h-0 flex-1 flex-col gap-[160px] overflow-y-auto px-[24px] py-[16px]">
        <MyPageHeader title="개인정보 동의" titleClassName="text-heading" onBack={goBack} />
        <section className="flex flex-col gap-[16px] pl-[16px]">
          <fieldset disabled={loading || isSaving}>
            <EmailInput value={email} onChange={(event) => { setEmail(event.target.value); if (!loading) setError(""); }} onClear={() => { setEmail(""); setError(""); }} />
          </fieldset>
          {loading && <p role="status" className="text-caption text-[#595959]">이메일을 불러오는 중...</p>}
          {error && <>
            <p role="alert" className="text-caption text-[#595959]">{error}</p>
            <button type="button" disabled={isSaving} onClick={() => { setError(""); setLoading(true); setLoadAttempt((value) => value + 1); }} className="self-start text-caption text-[#595959]">다시 불러오기</button>
          </>}
        </section>
      </div>
      <footer className="shrink-0 px-[16px] pt-[42px] pb-[max(30px,env(safe-area-inset-bottom))]">
        <Button type="submit" text={isSaving ? "저장 중..." : "완료"} disabled={loading || isSaving || !validEmail || Boolean(error)} className="flex w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-title-semibold text-white disabled:cursor-not-allowed disabled:bg-[#d9d9d9]" />
      </footer>
    </form>
  );
};

export default NotificationEmailSettings;
