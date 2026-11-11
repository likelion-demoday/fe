import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TextBackButton from "../../components/common/TextBackButton";
import EmailInput from "../../components/feature/auth/EmailInput";
import { isValidEmail } from "../../utils/validation";

import { getMe } from "../../api/user";
import { saveNotificationEmail, updateNotifications, notificationErrorMessage } from "../../api/notifications";
import { consumeLoginReturn } from "../../utils/loginReturn";

const NotificationEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const pending = useRef(false);
  const trimmedEmail = email.trim();
  const canContinue = !loading && (!trimmedEmail || (trimmedEmail.length <= 100 && isValidEmail(trimmedEmail)));

  useEffect(() => {
    let active = true;
    getMe().then((user) => {
      if (active) { setEmail(user.email ?? ""); setLoading(false); }
    }).catch((error) => {
      if (active) { setError(error.message || "이메일을 불러오지 못했어요."); setLoading(false); }
    });
    return () => { active = false; };
  }, [loadAttempt]);

  const submitEmail = async (skip = false) => {
    if (pending.current || (!skip && !canContinue)) return;
    pending.current = true;
    setIsSaving(true);
    setError("");
    try {
      const value = skip ? "" : trimmedEmail;
      await saveNotificationEmail(value);
      if (value) await updateNotifications({ analysis: true });
      navigate(consumeLoginReturn(), { replace: true });
    } catch (error) {
      setError(notificationErrorMessage(error));
    } finally { pending.current = false; setIsSaving(false); }
  };

  const handleNext = (event) => {
    event.preventDefault();
    submitEmail();
  };

  return (
    <form onSubmit={handleNext} noValidate className="mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col bg-white">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-[80px] overflow-y-auto px-[24px] py-[16px]">
        <header className="flex flex-col items-start gap-[16px]">
          <p className="font-['SUIT',sans-serif] text-[20px] leading-normal font-extrabold tracking-[-0.8px] text-black">
            RE<span className="text-[#ff765b]">:S</span><span className="tracking-[-1.28px]">AY</span>
          </p>
          <TextBackButton onClick={() => navigate("/onboarding/consent", { replace: true })} />
        </header>
        <section className="flex flex-col gap-[60px] pl-[16px]">
          <div className="flex flex-col gap-[6px]">
            <h1 className="text-heading text-black">
              분석 완료시 알림이 필요하다면<br />
              알림을 받을 이메일을 입력해주세요
            </h1>
            <p className="text-caption text-[#787e8c]">설정에서 변경할 수 있어요.</p>
          </div>
          <fieldset disabled={loading || isSaving}>
          <EmailInput
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onClear={() => setEmail("")}
          />
          </fieldset>
          {loading && <p role="status">이메일을 불러오는 중...</p>}
          {error && <p role="alert">{error}</p>}
          {error && <button type="button" disabled={isSaving} onClick={() => { setError(""); setLoading(true); setLoadAttempt((v) => v + 1); }}>이메일 다시 불러오기</button>}
        </section>
      </div>
      <footer className="flex shrink-0 flex-col items-center gap-[24px] px-[16px] pt-[10px] pb-[max(30px,env(safe-area-inset-bottom))]">
        <div aria-label="온보딩 3단계 중 3단계" className="flex items-center justify-center gap-[12px]">
          {[0, 1, 2].map((step) => <span key={step} className="size-[8px] rounded-full bg-[#454545]" />)}
        </div>
        <Button
          type="submit"
          text={isSaving ? "저장 중..." : "다음"}
          disabled={!canContinue || isSaving}
          className="flex w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white disabled:cursor-not-allowed disabled:bg-[#d9d9d9]"
        />
        <button type="button" disabled={isSaving} onClick={() => submitEmail(true)} className="text-body text-[#595959] disabled:opacity-50">건너뛰기</button>
      </footer>
    </form>
  );
};

export default NotificationEmail;
