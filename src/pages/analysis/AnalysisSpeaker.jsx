import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getSpeakerSamples, mapSpeakers } from "../../api/recording";

import AppHeader from "../../components/common/AppHeader";
import BottomSheet, { SheetButton } from "../../components/common/BottomSheet";
import clipLeft1 from "../../assets/icons/voice-clip-left-1.svg";
import clipLeft2 from "../../assets/icons/voice-clip-left-2.svg";
import clipRight1 from "../../assets/icons/voice-clip-right-1.svg";
import clipRight2 from "../../assets/icons/voice-clip-right-2.svg";


const USER_NAME = "OOO";


const PARTNER_NAME_MAX = 7;


const PARTNER_LABELS = {
  friend: "친구를",
  lover: "연인을",
  family: "상대방을",
};

const SPEAKER_LAYOUTS = [
  {
    align: "left",
    clips: [
      { src: clipLeft1, inset: "inset-[-50%_-10.53%_-50%_-15.79%]" },
      { src: clipLeft2, inset: "inset-[-50%_-10.53%_-50%_-15.79%]" },
    ],
  },
  {
    align: "right",
    clips: [
      { src: clipRight1, inset: "inset-[-50%_-15.79%_-50%_-10.53%]" },
      { src: clipRight2, inset: "inset-[-28.5%_-11.26%_-28.5%_-6%]" },
    ],
  },
];


const toSpeakers = (apiSpeakers) =>
  apiSpeakers.slice(0, SPEAKER_LAYOUTS.length).map(({ speakerLabel, samples }, index) => {
    const layout = SPEAKER_LAYOUTS[index];
    return {
      id: index + 1,
      label: speakerLabel,
      align: layout.align,
      clips: layout.clips
        .slice(0, samples.length)
        .map((clip, clipIndex) => ({ ...clip, ...samples[clipIndex] })),
    };
  });

const SpeakerRow = ({ speaker, onSelect, onPlay }) => {
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
      {speaker.clips.map(({ src, inset, startMs, endMs }, index) => (
        <button
          key={src}
          type="button"
          onClick={() => onPlay(startMs, endMs)}
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
  const audioRef = useRef(null);
  const clipEndRef = useRef(null);

  // null | "confirm"(화자 확인) | "name"(상대방 호칭 입력)
  const [sheet, setSheet] = useState(null);
  const [speakerId, setSpeakerId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [speakers, setSpeakers] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const partnerLabel = PARTNER_LABELS[state?.relation] ?? "상대방을";
  const recordingId = state?.recordingId;

  useEffect(() => {
    if (!recordingId) return;
    getSpeakerSamples(recordingId)
      .then((result) => {
        setSpeakers(toSpeakers(result.speakers ?? []));
        setAudioUrl(result.audioUrl);
      })
      .catch((e) => alert(e.message ?? "화자 정보를 불러오지 못했어요."));
  }, [recordingId]);

  // 클립 구간(startMs~endMs)만 재생
  const playClip = (startMs, endMs) => {
    const audio = audioRef.current;
    if (!audio) return;
    clipEndRef.current = endMs / 1000;
    audio.currentTime = startMs / 1000;
    audio.play();
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (clipEndRef.current !== null && audio.currentTime >= clipEndRef.current) {
      audio.pause();
      clipEndRef.current = null;
    }
  };

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

  const handleSubmit = async () => {
    const selected = speakers.find(({ id }) => id === speakerId);
    if (!selected || submitting) return;

    setSubmitting(true);
    try {
      await mapSpeakers(recordingId, {
        selfSpeakerLabel: selected.label,
        partnerNickname: partnerName.trim(),
      });
      // TODO: 리포트 화면 생기면 그쪽으로 이동
      navigate("/home", { replace: true });
    } catch (e) {
      alert(e.message ?? "요청에 실패했어요. 다시 시도해 주세요.");
      setSubmitting(false);
    }
  };

  return (
    <main className="relative mx-auto flex h-[844px] w-[390px] flex-col gap-[30px] overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
      <AppHeader title="대화 분석" />

      <section className="flex w-full flex-col gap-[36px]">
        <h2 className="text-heading text-[#262626]">{USER_NAME}님의 목소리를 골라주세요</h2>
        <div className="flex w-full flex-col gap-[140px]">
          {speakers.map((speaker) => (
            <SpeakerRow
              key={speaker.id}
              speaker={speaker}
              onSelect={handleSelectSpeaker}
              onPlay={playClip}
            />
          ))}
        </div>
      </section>

      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" onTimeUpdate={handleTimeUpdate} />}

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
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && partnerName.trim()) handleSubmit();
                  }}
                  placeholder="입력하기"
                  maxLength={PARTNER_NAME_MAX}
                  aria-label="상대방 호칭"
                  aria-describedby="partner-name-limit"
                  className="text-display w-full bg-transparent text-center text-[#262626] outline-none placeholder:text-[#d9d9d9]"
                />
                {partnerName.length >= PARTNER_NAME_MAX && (
                  <p
                    id="partner-name-limit"
                    className="text-label-small absolute top-[-19px] left-[195px] whitespace-nowrap text-[#ff765b]"
                  >
                    최대 {PARTNER_NAME_MAX}자까지 가능해요
                  </p>
                )}
              </div>
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
