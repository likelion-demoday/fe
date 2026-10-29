import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAudioRecorder } from "../../hooks/useAudioRecorder.js";
import { uploadRecording } from "../../api/recording.js";

import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import BottomSheet from "../../components/common/BottomSheet";
import RecordEndSheet, {
  SheetButton,
} from "../../components/feature/analysis/RecordEndSheet";
import microphoneIcon from "../../assets/icons/microphone.svg";
import listenPlayButton from "../../assets/icons/listen-play-button.svg";
import micPermissionImage from "../../assets/images/mic-permission.png";
import recordStopImage from "../../assets/images/record-stop.png";
import recordArchiveImage from "../../assets/images/record-archive.png";

const MAX_SECONDS = 30 * 60;
const MIN_SECONDS = 5 * 60; // 5분 이상 녹음해야 녹음 끝내기 가능

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

// 바텀시트 캐릭터 자리 이미지 (136px 상자 기준 위치·크기)
const SHEET_IMAGES = {
  micPermission: { src: micPermissionImage, className: "inset-0 size-full object-cover" },
  stop: { src: recordStopImage, className: "inset-0 size-full object-cover" },
  archive: { src: recordArchiveImage, className: "top-[-8.29%] left-[-11.71%] h-[122.73%] w-[122.52%]" },
};

const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
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
  const [listening, setListening] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  // 들어보기 파일의 실제 길이 (마지막 조각이 빠져 elapsed보다 조금 짧을 수 있음)
  const [audioDuration, setAudioDuration] = useState(0);
  const [permissionDismissed, setPermissionDismissed] = useState(false);
  const [interruptDismissed, setInterruptDismissed] = useState(false);

  const recordingRef = useRef(null);
  const endingRef = useRef(false);
  const audioRef = useRef(null);

  const { status, error, interrupted, levels, head, start, pause, resume, stop, snapShot } =
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

  // 녹음 중(일시정지 포함) 화면 꺼짐 방지. 탭이 숨겨지면 브라우저가 해제하므로 다시 보일 때 재요청
  const keepAwake = status === "recording" || status === "paused";
  useEffect(() => {
    if (!keepAwake || !("wakeLock" in navigator)) return;
    let lock = null;
    let released = false;

    const request = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
        if (released) lock.release().catch(() => {});
      } catch {
        // 저전력 모드 등으로 거부되면 무시
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") request();
    };

    request();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      released = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      lock?.release().catch(() => {});
    };
  }, [keepAwake]);

  const endRecording = async () => {
    if (endingRef.current) return;
    endingRef.current = true;

    const result = await stop();
    if (result) recordingRef.current = result;
    setSheet("save");
  };

  const clearPreview = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  // 녹음 들어보기: 지금까지 녹음된 내용을 재생 화면에서 들려줌
  const replayRecording = async () => {
    pause();
    const result = await snapShot();
    if (!result) return;

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev); // 전에거 메모리 해제
      return URL.createObjectURL(result.blob);
    });
    setPlayedSeconds(0);
    setAudioDuration(0);
    setPlaying(false);
    setSheet(null);
    setListening(true);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  };

  // 확인: 재생을 멈추고 녹음 끝내기 확인 시트로 돌아감
  const finishListening = () => {
    audioRef.current?.pause();
    setListening(false);
    setPlaying(false);
    clearPreview();
    setSheet("confirm");
  };

  const closeConfirmSheet = () => {
    setSheet(null);
    clearPreview();
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
    setPermissionDismissed(false);
    setInterruptDismissed(false);
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

  const isIdle = status === "idle" && elapsed === 0;
  const showPermissionSheet = error === "denied" && !permissionDismissed;
  const showInterruptedSheet = interrupted && !interruptDismissed && !sheet && !listening;
  // 들어보기: 재생된 비율만큼 파형 전체 폭을 왼쪽부터 채움 (끝까지 재생하면 전부 채워짐)
  const totalSeconds = audioDuration || elapsed;
  const playedBars = totalSeconds > 0 ? Math.round(Math.min(1, playedSeconds / totalSeconds) * levels.length) : 0;

  if (listening) {
    return (
      <main className="relative mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col justify-between overflow-hidden bg-white">
        <div className="no-scrollbar flex min-h-0 w-full flex-1 flex-col items-center gap-[72px] overflow-y-auto [@media(max-height:843px)]:gap-[8px]">
          <div className="w-full px-[24px] py-[16px]">
            <AppHeader title="대화 분석" />
          </div>

          <div className="flex w-[343.5px] flex-col items-center gap-[72px] [@media(max-height:843px)]:gap-[24px]">
            <div className="flex w-full flex-col items-center gap-[80px] [@media(max-height:843px)]:gap-[24px]">
              <p className="text-heading w-full text-center text-black">
                {formatTime(Math.floor(playedSeconds))} / {formatTime(elapsed)}
              </p>
              <div className="flex h-[183px] w-full items-center gap-[3px]">
                {levels.map((level, index) => (
                  <span
                    key={index}
                    className={`w-[2.5px] shrink-0 rounded-[28px] ${
                      index < playedBars ? "bg-[#ff765b]" : "bg-[#eee]"
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

            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "일시정지" : "재생"}
              className="relative size-[90px] shrink-0"
            >
              {playing ? (
                <span className="absolute inset-0 overflow-clip rounded-[20px] bg-white shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_49.1px_0px_rgba(0,0,0,0.1)]">
                  <span className="absolute top-1/2 left-1/2 size-[40px] -translate-x-1/2 -translate-y-1/2 overflow-clip">
                    <span className="absolute top-[5px] left-[7px] h-[30px] w-[8px] rounded-[1px] bg-[#ff8d77]" />
                    <span className="absolute top-[5px] left-[24px] h-[30px] w-[8px] rounded-[1px] bg-[#ff8d77]" />
                  </span>
                </span>
              ) : (
                <span className="absolute inset-[-54.56%]">
                  <img src={listenPlayButton} alt="" className="block size-full max-w-none" />
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="w-full shrink-0 px-[24px] pt-[20px] pb-[30px]">
          <Button
            text="확인"
            onClick={finishListening}
            className="flex w-full items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white"
          />
        </div>

        {previewUrl && (
          <audio
            key={previewUrl}
            ref={audioRef}
            src={previewUrl}
            onLoadedMetadata={(e) => {
              const { duration } = e.currentTarget;
              if (Number.isFinite(duration)) setAudioDuration(duration);
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setPlayedSeconds(elapsed);
            }}
            onTimeUpdate={(e) => setPlayedSeconds(Math.min(elapsed, e.currentTarget.currentTime))}
          />
        )}
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col justify-between overflow-hidden bg-white">
      {/* 화면이 짧은 휴대폰에서는 위쪽만 스크롤되고 하단 버튼은 항상 보이게 함 */}
      <div className="no-scrollbar flex min-h-0 w-full flex-1 flex-col items-center gap-[72px] overflow-y-auto [@media(max-height:843px)]:gap-[8px]">
        <div className="w-full px-[24px] py-[16px]">
          <AppHeader title="대화 분석" onBack={() => navigate(-1)} />
        </div>

        <div className="flex w-[343.5px] flex-col items-center gap-[72px] [@media(max-height:843px)]:gap-[24px]">
          <div className="flex w-full flex-col items-center gap-[80px] [@media(max-height:843px)]:gap-[24px]">
            <div className="flex w-full flex-col items-center gap-[8px] text-center">
              {isIdle && (
                <p className="text-body text-[#6b6b6b]">녹음 중에는 화면이 꺼지지 않아요</p>
              )}
              <p className="text-heading w-full text-black">
                {formatTime(elapsed)} / {formatTime(MAX_SECONDS)}
              </p>
            </div>
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

            {error && error !== "denied" && (
              <p className="text-label text-center text-[#ff765b]">
                {ERROR_MESSAGES[error]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full shrink-0 px-[24px] pt-[20px] pb-[30px]">
        <Button
          text="녹음 끝내기"
          onClick={handleFinish}
          disabled={elapsed < MIN_SECONDS}
          className="flex w-full items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white disabled:bg-[#d9d9d9]"
        />
      </div>

      {sheet === "confirm" && (
        <RecordEndSheet
          elapsed={elapsed}
          title="녹음을 끝내시겠어요?"
          description={"녹음을 종료하면 다시 이어서 녹음할 수 없어요\n\n창을 닫으면 이어서 녹음할 수 있어요."}
          onClose={closeConfirmSheet}
        >
          <SheetButton text="녹음 들어보기" onClick={replayRecording} />
          <SheetButton text="녹음 끝내기" onClick={endRecording} />
        </RecordEndSheet>
      )}
      {sheet === "save" && (
        <RecordEndSheet
          elapsed={elapsed}
          title="녹음은 3일간 보관함에 저장돼요"
          description="분석일 기준 3일이 지나면 녹음은 자동 삭제돼요"
          image={SHEET_IMAGES.archive}
          onClose={() => setSheet(null)}
        >
          <SheetButton text="다음" onClick={() => handleSave(true)} />
        </RecordEndSheet>
      )}
      {showInterruptedSheet && (
        <RecordEndSheet
          elapsed={elapsed}
          sheetTitle="녹음 중단"
          title="녹음이 중단 됐어요"
          description={`지금까지 ${formatDuration(elapsed)}가 녹음 됐어요.\n현재 내용으로 분석을 시작 할까요?`}
          image={SHEET_IMAGES.stop}
          onClose={() => setInterruptDismissed(true)}
        >
          <SheetButton text="분석하기" onClick={endRecording} />
          <SheetButton text="이어서 녹음하기" onClick={resume} />
        </RecordEndSheet>
      )}
      {showPermissionSheet && (
        <BottomSheet
          title="마이크 권한이 필요해요"
          image={SHEET_IMAGES.micPermission}
          onClose={() => setPermissionDismissed(true)}
          footer={
            <SheetButton
              text="마이크 권한 설정하기"
              onClick={() => {
                setPermissionDismissed(true);
                start();
              }}
            />
          }
        >
          <p className="text-body w-full text-center whitespace-pre-line text-[#6b6b6b]">
            {"대화를 녹음하려면 브라우저의 마이크 사용 권한을\n허용해주세요."}
          </p>
        </BottomSheet>
      )}
    </main>
  );
};

export default AnalysisRecord;
