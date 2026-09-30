import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useMicVolume } from "../../hooks/useMicVolume.js";

import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import RecordEndSheet, {
  SheetButton,
} from "../../components/feature/analysis/RecordEndSheet";
import microphoneIcon from "../../assets/icons/microphone.svg";

const MAX_SECONDS = 60 * 60;

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const AnalysisRecord = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sheet, setSheet] = useState(null);

  const isRunning = isRecording && !isEnded && elapsed < MAX_SECONDS;
  const { levels, error } = useMicVolume(isRecording);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setElapsed((prev) => Math.min(prev + 1, MAX_SECONDS));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleFinish = () => {
    setSheet(isEnded ? "save" : "confirm");
  };

  const handleConfirmEnd = () => {
    setIsRecording(false);
    setIsEnded(true);
    setSheet("save");
  };

  const handleSave = (shouldSave) => {
    // TODO: 녹음 파일 업로드 및 분석 요청 API 연동
    console.log("녹음 저장 여부", {
      partner: state?.partner,
      elapsed,
      shouldSave,
    });
    navigate("/analysis/type", {
      replace: true,
      state: { partner: state?.partner, elapsed, shouldSave },
    });
  };

  if (error === "denied") return <p>마이크 권한을 허용해 주세요.</p>;

  return (
    <main className="relative mx-auto flex h-[844px] w-[390px] flex-col justify-between overflow-hidden bg-white">
      <div className="flex w-full flex-col items-center gap-[136px]">
        <div className="w-full px-[24px] py-[16px]">
          <AppHeader title="대화 분석" />
        </div>

        <div className="flex w-[343.5px] flex-col items-center gap-[93px]">
          <div className="flex w-full flex-col items-center gap-[107px]">
            <p className="text-heading w-full text-center text-black">
              {formatTime(elapsed)} / {formatTime(MAX_SECONDS)}
            </p>
            <div className="flex h-[100px] w-full items-center gap-[3px]">
              {levels.map((level, index) => (
                <span
                  key={index}
                  className="w-[2.5px] shrink-0 rounded-[28px] bg-[#ff765b]"
                  style={{
                    height: `${Math.max(4, Math.min(100, level * 120))}px`,
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRecording((prev) => !prev)}
            disabled={isEnded}
            aria-label={isRunning ? "녹음 일시정지" : "녹음 시작"}
            aria-pressed={isRunning}
            className={`flex size-[90px] items-center justify-center overflow-clip rounded-[20px] ${
              isRunning
                ? "bg-[#ffb0a0] shadow-[0px_0px_30px_0px_rgba(255,118,91,0.3)]"
                : "bg-white shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]"
            }`}
          >
            {isRunning ? (
              <span className="relative size-[40px] overflow-clip">
                <span className="absolute top-[5px] left-[7px] h-[30px] w-[8px] rounded-[1px] bg-white" />
                <span className="absolute top-[5px] left-[24px] h-[30px] w-[8px] rounded-[1px] bg-white" />
              </span>
            ) : (
              <img
                src={microphoneIcon}
                alt=""
                className="block size-[40px] max-w-none"
              />
            )}
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

      {sheet === "confirm" && (
        <RecordEndSheet
          elapsed={elapsed}
          title="녹음을 끝내시겠어요?"
          description="녹음을 종료하면 다시 이어서 녹음할 수 없어요"
          onClose={() => setSheet(null)}
        >
          <SheetButton text="녹음 끝내기" onClick={handleConfirmEnd} />
        </RecordEndSheet>
      )}
      {sheet === "save" && (
        <RecordEndSheet
          elapsed={elapsed}
          title="음성녹음을 저장할까요?"
          description="저장하지 않으면 녹음은 보고서에 사용된 후 삭제 돼요."
          onClose={() => setSheet(null)}
        >
          <SheetButton text="저장하지 않기" onClick={() => handleSave(false)} />
          <SheetButton text="저장하기" onClick={() => handleSave(true)} />
        </RecordEndSheet>
      )}
    </main>
  );
};

export default AnalysisRecord;
