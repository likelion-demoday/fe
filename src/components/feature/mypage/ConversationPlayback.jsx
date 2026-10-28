import { useRef, useState } from "react";
import MyPageHeader from "./MyPageHeader";
import Button from "../../common/Button";
import RecordingWaveform from "../analysis/RecordingWaveform";
import RecordingControl from "../analysis/RecordingControl";
import playIcon from "../../../assets/icons/recording-play.svg";
import dailyIcon from "../../../assets/icons/analysis-type-daily.svg";
import worryIcon from "../../../assets/icons/analysis-type-worry.svg";

const HEIGHTS = [56,26,56,26,120,56,68,90,56,30,68,32,56,90,26,183,120,56,12,32,30,90,56,90,56,26,56,120,68,30,56,32,160,90,56,26,12,56,68,120,30,56,90,12,56,80,56,32,30,56,32,84,12,120,56,12,90,160,56,26,30,56,120];
const LEVELS = HEIGHTS.map((height) => height / (183 * 1.08));
const formatTime = (value) => {
  const seconds = Math.max(0, Math.floor(value || 0));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

const ConversationPlayback = ({ conversation, onClose }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(conversation.durationSeconds ?? (conversation.durationMinutes || 0) * 60);
  const [error, setError] = useState("");
  const audioUrl = conversation.audioUrl;
  const conflict = conversation.relationshipType?.endsWith("_CONFLICT") || conversation.type === "worry";

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      return;
    }
    try {
      setError("");
      await audio.play();
    } catch {
      setError("녹음을 재생하지 못했어요. 다시 시도해주세요.");
    }
  };

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col justify-between bg-white">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-between pb-[50px]">
        <div className="w-full px-[24px] py-[16px]">
          <MyPageHeader title="대화 보관함" titleClassName="text-heading" />
        </div>
        <div className="flex flex-col items-center gap-[4px]">
          <p className="text-title-semibold text-[#262626]">{conversation.date}</p>
          <div className="flex items-center gap-[2px] rounded-[12px] bg-white p-[8px] drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)]">
            <img src={conflict ? worryIcon : dailyIcon} alt="" className="size-[20px]" />
            <span className="text-caption">{conflict ? "갈등 중심" : "일상 중심"}</span>
          </div>
        </div>
        <div className="flex w-[343.5px] flex-col items-center gap-[30px]">
          <p className="text-heading text-center">{formatTime(elapsed)} / {formatTime(duration)}</p>
          <div className="mt-[15px] w-full">
            <RecordingWaveform levels={LEVELS} head={elapsed > 0 && duration > 0 ? Math.floor(elapsed / duration * LEVELS.length) : -1} inactiveColor="#eee" />
          </div>
          <RecordingControl variant="listen" active={playing} onClick={togglePlayback} disabled={!audioUrl} label={playing ? "녹음 일시정지" : "녹음 재생"} iconIncludesShadow>
            <img src={playIcon} alt="" className="pointer-events-none absolute left-[-54.56%] top-[-54.56%] w-[209.12%] max-w-none" />
          </RecordingControl>
        </div>
        {(!audioUrl || error) && <p role="status" className="text-caption px-[24px] text-center text-[#787878]">{error || "재생할 음성 파일이 없어요."}</p>}
      </div>
      <div className="w-full px-[24px] pb-[30px] pt-[20px]">
        <Button text="확인" onClick={onClose} className="flex w-full items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white" />
      </div>
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" onLoadedMetadata={(event) => { if (Number.isFinite(event.currentTarget.duration)) setDuration(event.currentTarget.duration); }} onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setError("녹음을 불러오지 못했어요. 다시 시도해주세요."); }} />}
    </main>
  );
};

export default ConversationPlayback;
