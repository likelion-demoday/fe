import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import microphoneIcon from "../../assets/icons/microphone.svg";
import bubbleTailIcon from "../../assets/icons/bubble-tail.svg";

const SCRIPT_LINES = [
  "나 아는사람 강다니엘 닮은 이모가 ",
  "다시보게 되는게 다시 그때처럼 안 닮게 ",
  "엄마보면 느껴지는 걸수도 있는거임?",
  "엄마도?",
];

const WAVE_BARS = [6, 16, 36, 30, 8, 6, 34, 56, 10, 36, 18, 30, 8];

const MIC_ERROR_MESSAGES = {
  denied: "마이크 권한을 허용해 주세요.",
  notfound: "연결된 마이크를 찾을 수 없어요.",
  unknown: "마이크를 사용할 수 없어요. 다시 시도해 주세요.",
};

// 실제 등록이 아니라 마이크 동작 확인용: 입력 크기(0~1)만 측정
const useMicLevel = () => {
  const [isListening, setIsListening] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(0);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    setLevel(0);
    setIsListening(false);
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    setError(null);
    // 권한 팝업을 기다리는 사이 클릭 직후 상태가 끝나면 Chrome이 AudioContext를 suspended로 만들어
    // 입력이 계속 0으로 읽힘 → 클릭 시점에 만들고 권한을 받은 뒤 resume
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      await ctx.resume();

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);

      const data = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let peak = 0;
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128) / 128);
        // 말소리 피크는 보통 0.05~0.3이라 작은 소리도 보이게 키움
        setLevel(Math.min(1, Math.sqrt(peak * 4)));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      setIsListening(true);
    } catch (e) {
      stop();
      setError(
        e?.name === "NotAllowedError" || e?.name === "SecurityError"
          ? "denied"
          : e?.name === "NotFoundError"
            ? "notfound"
            : "unknown",
      );
    }
  }, [stop]);

  return { isListening, level, error, start, stop };
};

const Waveform = ({ level }) => (
  <div className="flex size-[68px] items-center justify-center gap-[2.5px] overflow-clip">
    {WAVE_BARS.map((height, index) => (
      <span
        key={index}
        className="w-[2.5px] shrink-0 rounded-[28px] bg-white transition-[height] duration-75"
        style={{ height: `${Math.max(4, height * (0.15 + level * 0.85))}px` }}
      />
    ))}
  </div>
);

const VoiceRegister = () => {
  const navigate = useNavigate();
  const { isListening: isRecording, level, error, start, stop } = useMicLevel();
  const [hasRecorded, setHasRecorded] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stop();
      setHasRecorded(true);
    } else {
      start();
    }
  };

  const handleNext = () => {
    navigate("/onboarding/consent");
  };

  return (
    <div className="mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col items-start bg-[#fafafa]">
      <div className="no-scrollbar flex min-h-0 w-full flex-1 flex-col items-center gap-[80px] overflow-y-auto p-[16px]">
        <div className="flex w-full flex-col items-start">
          <BackButton onClick={handleBack} />
        </div>

        <div className="flex w-full flex-col items-start gap-[60px] px-[16px]">
          <div className="flex flex-col items-start gap-[6px] whitespace-nowrap">
            <h1 className="font-['SUITE',sans-serif] text-[24px] font-bold text-black">
              <span className="block leading-normal">목소리 등록을 위해</span>
              <span className="block leading-normal">아래의 글을 따라 읽어주세요</span>
            </h1>
            <p className="font-['SUITE',sans-serif] text-[13px] font-medium tracking-[0.39px] text-[#787e8c]">
              설정에서 변경할 수 있어요.
            </p>
          </div>

          <div className="relative flex w-full items-center justify-center gap-[10px] rounded-[16px] bg-white px-[18px] py-[12px] shadow-[0px_4px_5.85px_0px_rgba(0,0,0,0.05),0px_0px_23.85px_0px_rgba(0,0,0,0.1)]">
            <p className="font-['SUITE',sans-serif] text-[18px] font-semibold tracking-[0.72px] text-black">
              {SCRIPT_LINES.map((line) => (
                <span key={line} className="block leading-[26px] whitespace-pre">
                  {line}
                </span>
              ))}
            </p>
            <span className="absolute top-[47px] left-[-16px] flex size-[21px] -rotate-90 items-center justify-center">
              <img
                src={bubbleTailIcon}
                alt=""
                className="block h-[15.75px] w-[18.19px] max-w-none"
              />
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[48px] px-[16px] pt-[10px] pb-[30px]">
        <button
          type="button"
          onClick={toggleRecording}
          aria-label={isRecording ? "녹음 중지" : "녹음 시작"}
          aria-pressed={isRecording}
          className={`flex size-[90px] items-center justify-center overflow-clip rounded-[20px] ${
            isRecording
              ? "bg-[#ffb0a0] shadow-[0px_0px_30px_0px_rgba(255,118,91,0.3)]"
              : "bg-white shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]"
          }`}
        >
          {isRecording ? (
            <Waveform level={level} />
          ) : (
            <img src={microphoneIcon} alt="" className="block size-[40px] max-w-none" />
          )}
        </button>
        {error && (
          <p className="-mt-[32px] font-['SUITE',sans-serif] text-[13px] font-medium text-[#ff765b]">
            {MIC_ERROR_MESSAGES[error]}
          </p>
        )}

        <div className="flex w-full flex-col items-center gap-[24px]">
          <div className="flex items-center justify-center gap-[12px]">
            <span className="size-[8px] rounded-[99px] bg-[#454545]" />
            <span className="size-[8px] rounded-[99px] bg-[#454545]" />
            <span className="size-[8px] rounded-[99px] bg-[#d9d9d9]" />
          </div>
          <Button
            text="다음"
            onClick={handleNext}
            disabled={!hasRecorded}
            className="flex h-[49px] w-full max-w-[358px] items-center justify-center rounded-[12px] bg-[#262626] px-[26px] py-[14px] font-['Pretendard',sans-serif] text-[18px] font-semibold tracking-[-0.36px] text-white disabled:bg-[#d9d9d9]"
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceRegister;
