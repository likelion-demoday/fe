import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TextBackButton from "../../components/common/TextBackButton";
import IntroductionPreview from "./IntroductionPreview";
import { hasStoredLogin } from "../../utils/auth";
import { completeIntroduction, needsIntroduction } from "../../utils/introduction";
import SampleReport from "./SampleReport";
import useRevealProgress from "../../hooks/useRevealProgress";
import coins from "../../assets/images/introduction/coins.png";
import backSymbol from "../../assets/images/introduction/back-symbol.png";
import symbol from "../../assets/images/introduction/symbol.png";
import blurSymbol from "../../assets/images/introduction/blur-symbol.png";
import envelope from "../../assets/images/introduction/envelope.png";
import sideSymbol from "../../assets/images/introduction/side-symbol.png";
import topSymbol from "../../assets/images/introduction/top-symbol.png";
import characters from "../../assets/images/introduction/characters.webp";
import glowLeft from "../../assets/images/introduction/glow-left.svg";
import glowRight from "../../assets/images/introduction/glow-right.svg";
import "./introduction.css";

const SLIDES = [
  "말하는 사이\n우리 사이가 보인다",
  "말투부터 반응까지\n대화로 보는 나",
  "궁금하다면\n먼저 살짝 둘러볼까요?",
  "이제 진짜 내 대화를\n둘러볼 차례!",
];
const buttonClass = "flex w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#262626] active:bg-[#595959] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white";

function MetricCards() {
  const progress = useRevealProgress(true, 900);
  return <div className="intro-metrics">
    <div className="intro-metric intro-interest">
      <div className="flex items-center justify-between"><span className="intro-chip">관심도</span><strong aria-label="관심도 82%" className="tabular-nums">{Math.round(82 * progress)}%</strong></div>
      <p className="mt-[10px] text-[14px] leading-[20px] text-[#8c8c8c]">상대방의 일상과 감정에 관한 질문이<br />여러 번 등장했어요.</p>
      <div className="mt-[12px] h-[12px] rounded-full bg-[#fff0ef]"><div className="h-full origin-left rounded-full bg-linear-to-r from-[#ffe2d7] to-[#ff8d77]" style={{ width: "85.33%", transform: `scaleX(${progress})` }} /></div>
    </div>
    {[["표독력", "24%", "부드러운 표현"], ["T/F 반응", "98%", "감성폭발 F형"]].map(([label, score, caption]) =>
      <div className="intro-metric flex flex-col items-start gap-[9px]" key={label}>
        <span className="intro-chip">{label}</span><strong>{score}</strong><p className="text-[11px] text-[#817c83]">{caption}</p>
      </div>)}
  </div>;
}

export default function Introduction() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showSample, setShowSample] = useState(false);
  useEffect(() => {
    const image = new Image();
    image.src = characters;
    // 마지막 페이지에 도달하기 전에 다운로드와 디코딩을 시작합니다.
    image.decode().catch(() => {});
  }, []);
  const isLoggedIn = hasStoredLogin();
  if (!needsIntroduction()) return <Navigate to={isLoggedIn ? "/home" : "/auth/login"} replace />;

  const finish = (path) => {
    completeIntroduction();
    navigate(isLoggedIn ? path : "/auth/login", { replace: true });
  };
  const back = () => {
    if (showSample) setShowSample(false);
    else if (step > 0) setStep(step - 1);
    else finish("/home");
  };

  if (showSample) return <SampleReport onBack={back} onComplete={() => { setShowSample(false); setStep(3); }} />;

  return (
    <main className={`intro-screen${step === 0 ? " intro-screen-welcome" : step === 2 ? " intro-screen-preview" : step === 3 ? " intro-screen-start" : ""}`}>
      <div key={step} className="intro-scroll no-scrollbar">
        <div className="intro-stage">
          {step === 0 && <div aria-hidden="true" className="intro-art">
            <div className="intro-coins"><img src={coins} alt="" /></div>
            <img className="intro-back-symbol" src={backSymbol} alt="" />
            <div className="intro-main-symbol"><img src={symbol} alt="" /></div>
            <img className="intro-blur-symbol" src={blurSymbol} alt="" />
            <img className="intro-envelope" src={envelope} alt="" />
            <img className="intro-side-symbol" src={sideSymbol} alt="" />
            <img className="intro-top-symbol" src={topSymbol} alt="" />
          </div>}
          {step === 3 && <div aria-hidden="true" className="intro-art">
            <div className="intro-glow-left"><img src={glowLeft} alt="" /></div>
            <div className="intro-glow-right"><img src={glowRight} alt="" /></div>
            <img className="intro-characters" src={characters} alt="" />
          </div>}
          <header className="intro-header">
            <p className="font-['SUIT',sans-serif] text-[20px] font-extrabold tracking-[-0.8px] text-black">RE<span className="text-[#ff765b]">:S</span><span className="tracking-[-1.28px]">AY</span></p>
            <div className="mt-[16px] flex items-center justify-between">
              <TextBackButton onClick={back} />
            </div>
          </header>
          <section className="intro-copy" aria-live="polite">
            <h1 className="text-display whitespace-pre-line text-[#29272c]">{SLIDES[step]}</h1>
          </section>
          {step === 2 && <IntroductionPreview />}
          {step === 1 && <MetricCards />}
        </div>
      </div>
      <footer className="intro-footer">
        <div className="flex justify-center gap-[12px]" aria-label={`서비스 소개 4단계 중 ${step + 1}단계`}>
          {SLIDES.map((_, index) => <span key={index} className={`size-[8px] rounded-full ${index <= step ? "bg-[#454545]" : "bg-[#d9d9d9]"}`} />)}
        </div>
        <div className={step === 0 || step === 2 ? "mx-auto flex w-full max-w-[342px] gap-[12px]" : "w-full"}>
          {step === 0 && <Button text="건너뛰기" className={`${buttonClass} min-w-0 flex-1 whitespace-nowrap`} onClick={() => finish("/home")} />}
          {step === 2 && <Button text="보고서 둘러보기" className={`${buttonClass} min-w-0 flex-1 whitespace-nowrap px-[12px]`} onClick={() => setShowSample(true)} />}
          <Button text={step === 3 ? "내 대화 분석 시작하기!" : "다음"} className={`${buttonClass}${step === 0 || step === 2 ? " min-w-0 flex-1 whitespace-nowrap" : ""}`} onClick={() => {
            if (step === 3) finish("/analysis");
            else setStep(step + 1);
          }} />
        </div>
      </footer>
    </main>
  );
}
