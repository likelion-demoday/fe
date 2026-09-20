import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SPLASH_DURATION = 500;

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
      {/* 디자인상 화면 정중앙보다 약 50px 위에 배치 */}
      <div className="flex -translate-y-[50px] flex-col items-center">
        {/* 심볼: Paperlogy SemiBold의 ":S"를 90도 회전한 형태 */}
        <div className="relative size-[142px]">
          <div className="absolute top-1/2 left-1/2 flex h-[97px] w-[121px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <p
              aria-hidden="true"
              className="rotate-90 font-['Paperlogy',sans-serif] text-[102.556px] leading-normal font-semibold tracking-[5.1278px] whitespace-nowrap text-[#ff765b]"
            >
              :S
            </p>
          </div>
        </div>

        <p className="-mt-[15px] font-['SUIT',sans-serif] text-[40px] leading-normal font-extrabold tracking-[-1.6px] whitespace-nowrap text-black">
          <span>RE</span>
          <span className="tracking-[-0.8px]">:</span>
          <span className="tracking-[-0.8px]">S</span>
          <span className="tracking-[-1.28px]">AY</span>
        </p>
      </div>
    </div>
  );
};

export default Splash;
