import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAudioRecorder } from "../../hooks/useAudioRecorder.js";
import { uploadRecording } from "../../api/recording.js";

import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import RecordEndSheet, {
  SheetButton,
} from "../../components/feature/analysis/RecordEndSheet";
import microphoneIcon from "../../assets/icons/microphone.svg";

import RecordingWaveform from "../../components/feature/analysis/RecordingWaveform";
import RecordingControl from "../../components/feature/analysis/RecordingControl";

const MAX_SECONDS = 30 * 60;


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
    if (isRunning) pause();
    setSheet(isEnded ? "save" : "confirm");
  };

  const handleSave = async () => {
  const recording = recordingRef.current;
  if (!recording) return;

  const file = new File([recording.blob], "recording.m4a", { type: "audio/mp4" });

  try {
    const { recordingId } = await uploadRecording(file);

    navigate("/analysis/type", {
      replace: true,
      state: { partner: state?.partner, elapsed, recordingId },
    });
  } catch (e) {
    alert(e.message ?? "업로드에 실패했어요. 다시 시도해 주세요.");
  }
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
            <RecordingWaveform levels={levels} head={head} />
          </div>

          <div className="flex flex-col items-center gap-[16px]">
            <RecordingControl
              active={isRunning}
              onClick={handleMicClick}
              disabled={isEnded}
              label={isRunning ? "녹음 일시정지" : "녹음 시작"}
            >
              <img src={microphoneIcon} alt="" className="block size-[40px] max-w-none" />
            </RecordingControl>

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
