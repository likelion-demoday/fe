import ReportCharacterCard from "./ReportCharacterCard";
import ScoreCompareBars from "./ScoreCompareBars";

// 한번에 보기: 두 사람의 캐릭터 + 핵심 점수 비교 + 한 줄 요약
const OverviewSection = ({ report }) => {
  const { speakers, overview } = report;

  return (
    <div className="flex w-full flex-col items-start gap-[22px]">
      <div className="flex w-full items-center gap-[20px]">
        <ReportCharacterCard
          nickname={speakers.me.nickname}
          nicknameColor="#ff765b"
          character={speakers.me.character}
        />
        <ReportCharacterCard
          nickname={speakers.partner.nickname}
          nicknameColor="#6d8cff"
          character={speakers.partner.character}
        />
      </div>

      <ScoreCompareBars scores={overview.scores} speakers={speakers} />

      <div className="flex w-full flex-col gap-[8px] overflow-clip rounded-[20px] border border-[#eee] bg-white p-[20px] font-['SUIT',sans-serif] shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]">
        <p className="text-[20px] font-bold text-[#262626]">{overview.summary.title}</p>
        <p className="text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#8c8c8c]">
          {overview.summary.description}
        </p>
      </div>
    </div>
  );
};

export default OverviewSection;
