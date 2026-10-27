import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FrequentWordsCard from "./FrequentWordsCard";
import SpeakingSpeedCard from "./SpeakingSpeedCard";
import SpeakingLengthCard from "./SpeakingLengthCard";
import ProfanityRateCard from "./ProfanityRateCard";
import HabitHistoryCard from "./HabitHistoryCard";
import chevronRightIcon from "../../../assets/icons/chevron-right.svg";

import { getAnalysisSummary } from "../../../api/analysis";

const SLIDE_GAP = 24;

const SLIDES = [
  {
    id: "frequent-words",
    render: (active, summary, onDetail) => (
      <FrequentWordsCard
        active={active}
        onDetail={onDetail}
        count={summary.analysisCount}
        expressions={summary.frequentExpressions ?? []}
      />
    ),
  },
  {
    id: "speaking-speed",
    render: (active, summary, onDetail) => (
      <SpeakingSpeedCard
        active={active}
        onDetail={onDetail}
        count={summary.analysisCount}
        diffPercent={summary.speakingSpeed?.differencePercent ?? 0}
      />
    ),
  },
  {
    id: "profanity-rate",
    render: (active, summary, onDetail) => (
      <ProfanityRateCard
        active={active}
        onDetail={onDetail}
        count={summary.analysisCount}
        rate={summary.swearWordUsage?.ratePercent ?? null}
      />
    ),
  },
  {
    id: "habit-history",
    render: (active, summary, onDetail) => (
      <HabitHistoryCard
        active={active}
        onDetail={onDetail}
        count={summary.analysisCount}
        history={summary.speakingRatioHistory ?? []}
      />
    ),
  },
  {
    id: "speaking-length",
    render: (active, summary, onDetail) => <SpeakingLengthCard active={active} onDetail={onDetail} count={summary.analysisCount} />,
  },
];

const EmptySummaryCard = ({ onDetail }) => (
  <section className="flex w-full flex-col items-center gap-[20px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[20px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_24.55px_rgba(0,0,0,0.1)]">
    <div className="flex w-full flex-col gap-[4px]">
      <p className="text-caption invisible text-[#bfbfbf]">최근 n회 분석 기준</p>
      <div className="flex w-full items-center justify-between">
        <h3 className="text-title-semibold flex-1 text-black">자주 사용하는 말</h3>
        <button
          type="button"
          onClick={onDetail}
          className="flex items-center justify-center gap-[2px] rounded-[6px] px-[6px]"
        >
          <span className="text-caption whitespace-nowrap text-[#8c8c8c]">자세히 보기</span>
          <img src={chevronRightIcon} alt="" className="block h-[11px] w-[7px] max-w-none shrink-0" />
        </button>
      </div>
    </div>

    <div className="flex h-[154px] w-[290px] shrink-0 items-center justify-center">
      <p className="text-caption text-[#595959]">아직 분석된 대화가 없어요</p>
    </div>
  </section>
);

const HabitSummaryCarousel = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [summary, setSummary] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const goToReports = () => navigate("/recordings/reports");

  const handleScroll = (e) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    const step = clientWidth - 48 + SLIDE_GAP;
    setActiveIndex(Math.round(scrollLeft / step));
  };

  useEffect(()=> {
    const fetchSummary = async () => {
      try {
        const result = await getAnalysisSummary();
        setSummary(result);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoaded(true);
      }
    }

    fetchSummary();
  },[])

  if (!loaded) {
    return (
      <div className="invisible" aria-hidden>
        <EmptySummaryCard />
      </div>
    );
  }
  if (!summary || !summary.analysisCount) return <EmptySummaryCard onDetail={goToReports} />;

  return (
    <div className="relative w-full">
      <div
        onScroll={handleScroll}
        className="no-scrollbar -mx-[24px] -my-[24px] flex snap-x snap-mandatory scroll-px-[24px] overflow-x-auto px-[24px] py-[24px]"
        style={{ gap: SLIDE_GAP }}
      >
        {SLIDES.map(({ id, render }, index) => (
          <div key={id} className="w-full shrink-0 snap-start">
            {render(index === activeIndex, summary, goToReports)}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-[20px] left-1/2 flex -translate-x-1/2 items-center gap-[12px]">
        {Array.from({ length: SLIDES.length }, (_, index) => (
          <span
            key={index}
            className={`size-[8px] rounded-[99px] ${index === activeIndex ? "bg-[#454545]" : "bg-[#d9d9d9]"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HabitSummaryCarousel;
