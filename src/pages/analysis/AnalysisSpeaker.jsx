import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AppHeader from "../../components/common/AppHeader";
import BottomSheet, { SheetButton } from "../../components/common/BottomSheet";
import clipLeft1 from "../../assets/icons/voice-clip-left-1.svg";
import clipLeft2 from "../../assets/icons/voice-clip-left-2.svg";
import clipRight1 from "../../assets/icons/voice-clip-right-1.svg";
import clipRight2 from "../../assets/icons/voice-clip-right-2.svg";

// TODO: 사용자 닉네임 API 연동 전 임시 값
const USER_NAME = "OOO";

// 보고서에서 상대방을 부를 이름을 묻는 문구
const PARTNER_LABELS = {
  friend: "친구를",
  lover: "연인을",
  family: "상대방을",
};

// 화자별 음성 클립 말풍선 (디자인 기준 190x40 슬롯, SVG는 그림자 포함 크기)
const SPEAKERS = [
  {
    id: 1,
    align: "left",
    clips: [
      { src: clipLeft1, inset: "inset-[-50%_-10.53%_-50%_-15.79%]" },
      { src: clipLeft2, inset: "inset-[-50%_-10.53%_-50%_-15.79%]" },
    ],
  },
  {
    id: 2,
    align: "right",
    clips: [
      { src: clipRight1, inset: "inset-[-50%_-15.79%_-50%_-10.53%]" },
      { src: clipRight2, inset: "inset-[-28.5%_-11.26%_-28.5%_-6%]" },
    ],
  },
];

const SpeakerRow = ({ speaker, onSelect }) => {
  const card = (
    <button
      type="button"
      onClick={() => onSelect(speaker.id)}
      className="flex w-[130px] shrink-0 items-center justify-center self-stretch overflow-clip rounded-[16px] border border-[#eee] bg-white px-[42px] py-[30px] shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]"
    >
      <span className="text-heading whitespace-nowrap text-black">화자 {speaker.id}</span>
    </button>
  );

  const clips = (
    <div className="flex w-[190px] shrink-0 flex-col justify-center gap-[16px]">
      {speaker.clips.map(({ src, inset }, index) => (
        <button
          key={src}
          type="button"
          // TODO: 화자별 음성 클립 재생
          onClick={() => console.log("음성 클립 재생", speaker.id, index)}
          aria-label={`화자 ${speaker.id} 음성 ${index + 1} 듣기`}
          className="relative h-[40px] w-full"
        >
          <img src={src} alt="" className={`absolute block max-w-none ${inset}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className={`flex w-full items-start gap-[22px] ${speaker.align === "right" ? "justify-end" : ""}`}>
      {speaker.align === "left" ? (
        <>
          {card}
          {clips}
        </>
      ) : (
        <>
          {clips}
          {card}
        </>
      )}
    </div>
  );
};

const AnalysisSpeaker = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const inputRef = useRef(null);

  // null | "confirm"(화자 확인) | "name"(상대방 호칭 입력)
  const [sheet, setSheet] = useState(null);
  const [speakerId, setSpeakerId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [partnerName, setPartnerName] = useState("");

  const partnerLabel = PARTNER_LABELS[state?.relation] ?? "상대방을";

  const handleSelectSpeaker = (id) => {
    setSpeakerId(id);
    setSheet("confirm");
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    // 입력창이 렌더링된 뒤 포커스
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleCloseNameSheet = () => {
    setSheet(null);
    setIsEditing(false);
    setPartnerName("");
  };

  const handleSubmit = () => {
    // TODO: 화자/호칭 저장 API 연동 후 리포트 화면으로 이동
    console.log("화자 선택 완료", { ...state, speakerId, partnerName: partnerName.trim() });
    navigate("/home", { replace: true });
  };

  return (
    <main className="relative mx-auto flex h-[844px] w-[390px] flex-col gap-[30px] overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
      <AppHeader title="대화 분석" />

      <section className="flex w-full flex-col gap-[36px]">
        <h2 className="text-heading text-[#262626]">{USER_NAME}님의 목소리를 골라주세요</h2>
        <div className="flex w-full flex-col gap-[140px]">
          {SPEAKERS.map((speaker) => (
            <SpeakerRow key={speaker.id} speaker={speaker} onSelect={handleSelectSpeaker} />
          ))}
        </div>
      </section>

      {sheet === "confirm" && (
        <BottomSheet
          title={`화자 ${speakerId}`}
          onClose={() => setSheet(null)}
          headerGap="gap-[30px]"
          contentGap="gap-[4px]"
          footer={<SheetButton text="확인" onClick={() => setSheet("name")} />}
        >
          <div className="flex w-full flex-col items-center gap-[21px] whitespace-nowrap">
            <h3 className="text-heading text-black">{USER_NAME}님이 맞으신가요?</h3>
            <p className="text-label text-[#595959]">잘못 골랐어도 이후에 수정 가능해요</p>
          </div>
        </BottomSheet>
      )}

      {sheet === "name" && (
        <BottomSheet
          title={
            isEditing ? (
              <input
                ref={inputRef}
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && partnerName.trim()) handleSubmit();
                }}
                placeholder="입력하기"
                maxLength={10}
                aria-label="상대방 호칭"
                className="text-display w-full bg-transparent text-center text-[#262626] outline-none placeholder:text-[#d9d9d9]"
              />
            ) : (
              <div className="h-[37px]" />
            )
          }
          onClose={handleCloseNameSheet}
          headerGap="gap-[30px]"
          contentGap="gap-[4px]"
          footer={
            <>
              <SheetButton text="입력하기" onClick={handleStartEditing} />
              <SheetButton text="확인" onClick={handleSubmit} disabled={!partnerName.trim()} />
            </>
          }
        >
          <div className="flex w-full flex-col items-center gap-[21px] whitespace-nowrap">
            <h3 className="text-heading text-center text-black">
              {partnerLabel} 보고서에서 어떻게 부를까요?
            </h3>
            <p className="text-label text-[#595959]">잘못 골랐어도 이후에 수정 가능해요</p>
          </div>
        </BottomSheet>
      )}
    </main>
  );
};

export default AnalysisSpeaker;
