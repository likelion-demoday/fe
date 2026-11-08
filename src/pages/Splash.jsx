import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import splashLogoSymbol from "../assets/icons/splash-logo-symbol.svg";
import { hasStoredLogin } from "../utils/auth";
import { needsIntroduction } from "../utils/introduction";

const SPLASH_DURATION = 500;

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const destination = needsIntroduction() ? "/onboarding/introduction"
        : hasStoredLogin() ? "/home" : "/auth/login";
      navigate(destination, { replace: true });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="mx-auto flex h-[844px] w-[390px] overflow-y-auto no-scrollbar items-center justify-center bg-white">
      {/* 디자인상 로고 그룹 상단이 y=289 → 화면 정중앙보다 약 42px 위 */}
      <div className="flex -translate-y-[42px] flex-col items-center">
        <div className="relative size-[142px]">
          <img
            src={splashLogoSymbol}
            alt=""
            aria-hidden="true"
            className="absolute top-[28px] left-1/2 block max-w-none -translate-x-1/2"
          />
        </div>

        <p className="-mt-[9px] font-['SUIT',sans-serif] text-[40px] leading-normal font-extrabold tracking-[-1.6px] whitespace-nowrap text-black">
          <span>RE</span>
          <span className="tracking-[-0.8px] text-[#ff765b]">:S</span>
          <span className="tracking-[-1.28px]">AY</span>
        </p>
      </div>
    </div>
  );
};

export default Splash;
