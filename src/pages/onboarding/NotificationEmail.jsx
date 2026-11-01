import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TextBackButton from "../../components/common/TextBackButton";
import EmailInput from "../../components/feature/auth/EmailInput";
import { isValidEmail } from "../../utils/validation";

const NotificationEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem("notificationEmail") ?? "");
  const trimmedEmail = email.trim();
  const canContinue = !trimmedEmail || isValidEmail(trimmedEmail);

  const handleNext = (event) => {
    event.preventDefault();
    if (!canContinue) return;
    // 알림 이메일 저장 API가 연결되기 전까지 이 브라우저에 보관합니다.
    if (trimmedEmail) localStorage.setItem("notificationEmail", trimmedEmail);
    else localStorage.removeItem("notificationEmail");
    navigate("/home", { replace: true });
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
          <EmailInput
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onClear={() => setEmail("")}
          />
        </section>
      </div>
      <footer className="flex shrink-0 flex-col items-center gap-[24px] px-[16px] pt-[10px] pb-[max(30px,env(safe-area-inset-bottom))]">
        <div aria-label="온보딩 4단계 중 4단계" className="flex items-center justify-center gap-[12px]">
          {[0, 1, 2, 3].map((step) => <span key={step} className="size-[8px] rounded-full bg-[#454545]" />)}
        </div>
        <Button
          type="submit"
          text="다음"
          disabled={!canContinue}
          className="flex w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white disabled:cursor-not-allowed disabled:bg-[#d9d9d9]"
        />
      </footer>
    </form>
  );
};

export default NotificationEmail;
