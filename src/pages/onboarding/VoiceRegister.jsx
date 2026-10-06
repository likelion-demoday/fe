import { useState } from "react";
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

const Waveform = () => (
  <div className="flex size-[68px] items-center justify-center gap-[2.5px] overflow-clip">
    {WAVE_BARS.map((height, index) => (
      <span
        key={index}
        className="w-[2.5px] shrink-0 rounded-[28px] bg-white"
        style={{
          height: `${height}px`,
          animation: "voice-wave 0.9s ease-in-out infinite",
          animationDelay: `${(index % 5) * 0.12}s`,
        }}
      />
    ))}
  </div>
);

const VoiceRegister = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const handleBack = () => {
    console.log("뒤로가기 버튼 클릭");
    navigate(-1);
  };

  const toggleRecording = () => {
    setIsRecording((prev) => {
      if (prev) setHasRecorded(true);
      return !prev;
    });
  };

  const handleNext = () => {
    console.log("다음 버튼 클릭");
    navigate("/home", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-start justify-between bg-[#fafafa]">
      <div className="flex w-full flex-col items-center gap-[80px] p-[16px]">
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

      <div className="flex w-full flex-col items-center justify-center gap-[48px] px-[16px] pt-[10px] pb-[30px]">
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
            <Waveform />
          ) : (
            <img src={microphoneIcon} alt="" className="block size-[40px] max-w-none" />
          )}
        </button>

        <div className="flex w-full flex-col items-center gap-[24px]">
          <div className="flex items-center justify-center gap-[12px]">
            <span className="size-[8px] rounded-[99px] bg-[#454545]" />
            <span className="size-[8px] rounded-[99px] bg-[#454545]" />
            <span className="size-[8px] rounded-[99px] bg-[#454545]" />
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
