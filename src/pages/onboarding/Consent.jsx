import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import { oauthSignUp, signUp } from "../../api/auth";

import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import circleIcon from "../../assets/icons/check-circle.svg";
import chevronRightIcon from "../../assets/icons/chevron-right.svg";
import dividerIcon from "../../assets/icons/divider.svg";
import MarketingConsent from "../mypage/MarketingConsent";
import VoiceInformationConsent from "../mypage/VoiceInformationConsent";
import ServiceTerms from "../mypage/ServiceTerms";
import PersonalInformationConsent from "../mypage/PersonalInformationConsent";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";

const AGREEMENT_PAGES = {
  terms: ServiceTerms,
  privacy: PersonalInformationConsent,
  voice: VoiceInformationConsent,
  marketing: MarketingConsent,
};

const AGREEMENTS = [
  { id: "terms", label: "[필수] 서비스 이용약관 동의", required: true },
  { id: "privacy", label: "[필수] 개인정보 수집 • 이용 동의", required: true },
  { id: "voice", label: "[필수] 음성정보 처리 동의", required: true },
  { id: "marketing", label: "[선택] 마케팅 정보 수신 동의", required: false },
];

const CheckCircle = ({ checked, accountMode = false }) => {
  if (checked) {
    return <span className={`size-[20px] shrink-0 rounded-full ${accountMode ? "bg-[#6b6b6b]" : "bg-[#454545]"}`} />;
  }
  return (
    <span className="relative size-[20px] shrink-0">
      <img
        src={circleIcon}
        alt=""
        className="absolute inset-0 block size-full max-w-none"
      />
    </span>
  );
};

const Divider = () => (
  <img
    src={dividerIcon}
    alt=""
    className="block h-px w-full max-w-none shrink-0"
  />
);

const Consent = ({ accountMode = false }) => {
  const { email, password, nickname, registerToken } = useAuthStore();
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const [checked, setChecked] = useState({});
  const [activeAgreement, setActiveAgreement] = useState(null);

  const allChecked = AGREEMENTS.every(({ id }) => checked[id]);
  const requiredChecked = AGREEMENTS.filter(({ required }) => required).every(
    ({ id }) => checked[id],
  );

  const toggle = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(Object.fromEntries(AGREEMENTS.map(({ id }) => [id, next])));
  };

  const handleBack = () => {
    if (accountMode) navigate("/mypage/account");
    else navigate(-1);
  };

  const handleNext = async () => {
    const agreements = Object.fromEntries(AGREEMENTS.map(({ id }) => [id, Boolean(checked[id])]));

    try {
      // 이메일·소셜 가입 모두 응답으로 토큰을 받아 바로 로그인 상태로 전환
      const result = registerToken
        ? await oauthSignUp({ registerToken, nickname, agreements })
        : await signUp({ email, password, nickname, agreements });
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("isLogin", "true");
      clearAuthData();
      navigate("/home", { replace: true });
    } catch (error) {
      if (error.code === "AUTH401_4") {
        // registerToken 만료(30분) 또는 재사용 → 소셜 로그인부터 다시
        clearAuthData();
        alert("가입 시간이 지났어요. 다시 로그인해 주세요.");
        navigate("/auth/login", { replace: true });
      } else if (error.code === "AUTH409_1") {
        setErrorMessage("이미 가입된 이메일입니다.");
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const handleView = (id) => {
    setActiveAgreement(id);
  };

  const AgreementPage = AGREEMENT_PAGES[activeAgreement];
  if (AgreementPage) {
    return <AgreementPage onBack={() => setActiveAgreement(null)} />;
  }

  return (
    <div className="mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col items-start bg-white">
      <div className={`no-scrollbar flex min-h-0 w-full flex-1 flex-col items-center gap-[80px] overflow-y-auto ${accountMode ? "px-[24px] py-[16px]" : "p-[16px]"}`}>
        <div className="flex w-full flex-col items-start">
          {accountMode ? (
            <MyPageHeader title="개인정보 동의" titleClassName="text-heading" onBack={handleBack} />
          ) : <BackButton onClick={handleBack} />}
        </div>

        <div className="flex w-full flex-col items-start gap-[60px] px-[16px]">
          {!accountMode && <h1 className="font-['SUITE',sans-serif] text-[24px] font-bold whitespace-nowrap text-black">
            <span className="block leading-normal">서비스 이용을 위해</span>
            <span className="block leading-normal">
              아래의 정보 활용에 동의해주세요
            </span>
          </h1>}

          <div className="flex w-full flex-col items-start gap-[16px]">
            <button
              type="button"
              onClick={toggleAll}
              aria-pressed={allChecked}
              className="flex items-center gap-[12px]"
            >
              <CheckCircle checked={allChecked} accountMode={accountMode} />
              <span className="font-['SUITE',sans-serif] text-[18px] font-semibold tracking-[0.72px] whitespace-nowrap text-[#262626]">
                전체 동의
              </span>
            </button>

            {AGREEMENTS.map(({ id, label }, index) => (
              <div key={id} className="contents">
                {index === 0 && <Divider />}
                <div className={`flex items-center justify-between ${accountMode ? "w-[326px]" : "w-full"}`}>
                  <button
                    type="button"
                    onClick={() => toggle(id)}
                    aria-pressed={Boolean(checked[id])}
                    className="flex items-center gap-[12px]"
                  >
                    <CheckCircle checked={Boolean(checked[id])} accountMode={accountMode} />
                    <span className="font-['SUITE',sans-serif] text-[16px] font-semibold whitespace-nowrap text-[#262626]">
                      {label}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleView(id)}
                    className="flex items-center justify-center gap-[2px] rounded-[6px] px-[6px]"
                  >
                    <span className="font-['SUITE',sans-serif] text-[13px] font-medium tracking-[0.39px] whitespace-nowrap text-[#8c8c8c]">
                      보기
                    </span>
                    <img
                      src={chevronRightIcon}
                      alt=""
                      className="block h-[11px] w-[7px] max-w-none shrink-0"
                    />
                  </button>
                </div>
                {index < AGREEMENTS.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[24px] px-[16px] pt-[10px] pb-[30px]">
        <div className="flex h-[8px] items-center justify-center gap-[12px]">
          {!accountMode && <>
            <span className="size-[8px] rounded-[99px] bg-[#454545]" />
            <span className="size-[8px] rounded-[99px] bg-[#454545]" />
            <span className="size-[8px] rounded-[99px] bg-[#454545]" />
          </>}
        </div>
        <div className="flex w-full max-w-[358px] flex-col items-start gap-[4px]">
          {errorMessage && <p className="...">{errorMessage}</p>}
          <Button
            text={accountMode ? "완료" : "다음"}
            onClick={accountMode ? handleBack : handleNext}
            disabled={!accountMode && !requiredChecked}
            className={accountMode
              ? "flex w-full max-w-[358px] items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white"
              : "flex h-[49px] w-full max-w-[358px] items-center justify-center rounded-[12px] bg-[#262626] px-[26px] py-[14px] font-['Pretendard',sans-serif] text-[18px] font-semibold tracking-[-0.36px] text-white disabled:bg-[#d9d9d9]"}
          />
        </div>
      </div>
    </div>
  );
};

export default Consent;
