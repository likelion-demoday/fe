import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAudioRecorder } from "../../hooks/useAudioRecorder.js";

import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import RecordEndSheet, {
  SheetButton,
} from "../../components/feature/analysis/RecordEndSheet";
import microphoneIcon from "../../assets/icons/microphone.svg";

const MAX_SECONDS = 60 * 60;

const WAVE_HEIGHT = 183;
const WAVE_MIN_HEIGHT = 4;
const WAVE_GAIN = 1.08;

const ERROR_MESSAGES = {
  denied: "마이크 권한을 허용해 주세요.",
  notfound: "사용할 수 있는 마이크를 찾지 못했어요.",
  busy: "다른 앱이 마이크를 사용하고 있어요.",
  unsupported: "이 브라우저에서는 녹음을 지원하지 않아요.",
  unknown: "녹음을 시작할 수 없어요. 잠시 후 다시 시도해 주세요.",
};

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const AnalysisRecord = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [elapsed, setElapsed] = useState(0);
  const [sheet, setSheet] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const recordingRef = useRef(null);
  const endingRef = useRef(false);

  const { status, error, levels, head, start, pause, resume, stop, snapShot } =
    useAudioRecorder();

  const isRunning = status === "recording";
  const isEnded = status === "stopped";

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setElapsed((prev) => Math.min(prev + 1, MAX_SECONDS));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const endRecording = async () => {
    if (endingRef.current) return;
    endingRef.current = true;

    const result = await stop();
    if (result) recordingRef.current = result;
    setSheet("save");
  };

  const replayRecording = async () => {
    pause();
    const result = await snapShot();
    if (!result) return;

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev); // 전에거 메모리 해제
      return URL.createObjectURL(result.blob);
    });
  };

  const closeConfirmSheet = () => {
    setSheet(null);

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  useEffect(() => {
    if (elapsed < MAX_SECONDS) return;
    endRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

  useEffect(() => {
    //언마운트 시 URL 해제
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleMicClick = () => {
    if (status === "idle") return start();
    if (status === "recording") return pause();
    if (status === "paused") return resume();
  };

  const handleFinish = () => {
    setSheet(isEnded ? "save" : "confirm");
  };

  const handleSave = (shouldSave) => {
    const recording = recordingRef.current;

    console.log("녹음 결과", {
      partner: state?.partner,
      elapsed,
      shouldSave,
      size: recording?.blob.size,
      mimeType: recording?.mimeType,
      url: recording ? URL.createObjectURL(recording.blob) : null,
    });

    navigate("/analysis/type", {
      replace: true,
      state: { partner: state?.partner, elapsed, shouldSave },
    });
  };

  return (
    <main className="relative mx-auto flex h-[844px] w-[390px] flex-col justify-between overflow-hidden bg-white">
      <div className="flex w-full flex-col items-center gap-[96px]">
        <div className="w-full px-[24px] py-[16px]">
          <AppHeader title="대화 분석" onBack={() => navigate(-1)} />
        </div>

        <div className="flex w-[343.5px] flex-col items-center gap-[93px]">
          <div className="flex w-full flex-col items-center gap-[107px]">
            <p className="text-heading w-full text-center text-black">
              {formatTime(elapsed)} / {formatTime(MAX_SECONDS)}
            </p>
            <div className="flex h-[183px] w-full items-center gap-[3px]">
              {levels.map((level, index) => (
                <span
                  key={index}
                  className={`w-[2.5px] shrink-0 rounded-[28px] ${
                    index <= head ? "bg-[#ff765b]" : "bg-[#d9d9d9]"
                  }`}
                  style={{
                    height: `${Math.max(
                      WAVE_MIN_HEIGHT,
                      Math.min(WAVE_HEIGHT, level * WAVE_HEIGHT * WAVE_GAIN),
                    )}px`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-[16px]">
            <button
              type="button"
              onClick={handleMicClick}
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

            {error && (
              <p className="text-label text-center text-[#ff765b]">
                {ERROR_MESSAGES[error]}
              </p>
            )}
          </div>
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
          preview={
            previewUrl && <audio key={previewUrl} src={previewUrl} autoPlay />
          }

          onClose={closeConfirmSheet}
        >
          <SheetButton text="녹음 들어보기" onClick={replayRecording} />
          <SheetButton text="녹음 끝내기" onClick={endRecording} />
        </RecordEndSheet>
      )}
      {sheet === "save" && (
        <RecordEndSheet
          elapsed={elapsed}
          title="음성녹음을 저장할까요?"
          description="저장하지 않으면 녹음은 보고서에 사용된 후 삭제 돼요."
          onClose={() => setSheet(null)}
        >
          <SheetButton text="다음" onClick={() => handleSave(true)} />
        </RecordEndSheet>
      )}
    </main>
  );
};

export default AnalysisRecord;
