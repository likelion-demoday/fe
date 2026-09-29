import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import microphoneIcon from "../../assets/icons/microphone.svg";

const MAX_SECONDS = 60 * 60;

// 디자인 기준 막대 높이 (컨테이너 56px, 넘치는 막대는 위아래로 삐져나옴)
const WAVE_BARS = [
  56, 26, 56, 26, 120, 56, 68, 90, 56, 30, 68, 32, 56, 90, 26, 183, 120, 56, 12, 32, 30, 90,
  56, 90, 56, 26, 56, 120, 68, 30, 56, 32, 160, 90, 56, 26, 12, 56, 68, 120, 30, 56, 90, 12,
  56, 80, 56, 32, 30, 56, 32, 84, 12, 120, 56, 12, 90, 160, 56, 26, 30, 56, 120,
];

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const AnalysisRecord = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const isRunning = isRecording && elapsed < MAX_SECONDS;

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setElapsed((prev) => Math.min(prev + 1, MAX_SECONDS));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleFinish = () => {
    setIsRecording(false);
    // TODO: 녹음 파일 업로드 및 분석 요청 API 연동
    console.log("녹음 끝내기", { partner: state?.partner, elapsed });
    navigate("/home");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col justify-between overflow-x-hidden bg-white">
      <div className="flex w-full flex-col items-center gap-[136px]">
        <div className="w-full px-[24px] py-[16px]">
          <AppHeader title="대화 분석" />
        </div>

        <div className="flex w-[343.5px] flex-col items-center gap-[93px]">
          <div className="flex w-full flex-col items-center gap-[107px]">
            <p className="text-heading w-full text-center text-black">
              {formatTime(elapsed)} / {formatTime(MAX_SECONDS)}
            </p>
            <div className="flex h-[56px] w-full items-center gap-[3px]">
              {WAVE_BARS.map((height, index) => (
                <span
                  key={index}
                  className="w-[2.5px] shrink-0 rounded-[28px] bg-[#ff765b]"
                  style={{
                    height: `${height}px`,
                    animation: isRunning ? "voice-wave 0.9s ease-in-out infinite" : undefined,
                    animationDelay: `${(index % 5) * 0.12}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRecording((prev) => !prev)}
            aria-label={isRunning ? "녹음 일시정지" : "녹음 시작"}
            aria-pressed={isRunning}
            className={`flex size-[90px] items-center justify-center overflow-clip rounded-[20px] ${
              isRunning
                ? "bg-[#ffb0a0] shadow-[0px_0px_30px_0px_rgba(255,118,91,0.3)]"
                : "bg-white shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]"
            }`}
          >
            <img src={microphoneIcon} alt="" className="block size-[40px] max-w-none" />
          </button>
        </div>
      </div>

      <div className="w-full px-[24px] pt-[20px] pb-[30px]">
        <Button
          text="녹음 끝내기"
          onClick={handleFinish}
          disabled={elapsed === 0}
          className="flex w-full items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white disabled:bg-[#d9d9d9]"
        />
      </div>
    </main>
  );
};

export default AnalysisRecord;
