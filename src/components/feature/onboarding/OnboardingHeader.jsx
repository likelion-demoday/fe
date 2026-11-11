import TextBackButton from "../../common/TextBackButton";

// 온보딩 화면 상단: RE:SAY 로고 + 뒤로가기
const OnboardingHeader = ({ onBack }) => (
  <header className="flex w-full flex-col items-start gap-[16px]">
    <p className="font-['SUIT',sans-serif] text-[20px] leading-normal font-extrabold tracking-[-0.8px] text-black">
      RE<span className="text-[#ff765b]">:S</span><span className="tracking-[-1.28px]">AY</span>
    </p>
    <TextBackButton onClick={onBack} />
  </header>
);

export default OnboardingHeader;
