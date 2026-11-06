import { useState, useEffect } from "react";

import FrequentWordsCard from "./FrequentWordsCard";
import SpeakingSpeedCard from "./SpeakingSpeedCard";
import SpeakingLengthCard from "./SpeakingLengthCard";
import ProfanityRateCard from "./ProfanityRateCard";
import HabitHistoryCard from "./HabitHistoryCard";

import { getAnalysisSummary } from "../../../api/analysis";

const SLIDE_GAP = 24;

const SLIDES = [
  {
    id: "frequent-words",
    render: (active, summary) => (
      <FrequentWordsCard
        active={active}
        count={summary.analysisCount}
        expressions={summary.frequentExpressions ?? []}
      />
    ),
  },
  {
    id: "speaking-speed",
    render: (active, summary) => (
      <SpeakingSpeedCard
        active={active}
        count={summary.analysisCount}
        diffPercent={summary.speakingSpeed?.differencePercent ?? 0}
      />
    ),
  },
  {
    id: "profanity-rate",
    render: (active, summary) => (
      <ProfanityRateCard
        active={active}
        count={summary.analysisCount}
        rate={summary.swearWordUsage?.ratePercent ?? null}
      />
    ),
  },
  {
    id: "habit-history",
    render: (active, summary) => (
      <HabitHistoryCard
        active={active}
        count={summary.analysisCount}
        history={summary.speakingRatioHistory ?? []}
      />
    ),
  },
  {
    id: "speaking-length",
    render: (active, summary) => <SpeakingLengthCard active={active} count={summary.analysisCount} />,
  },
];

const EmptySummaryCard = () => (
  <section className="flex w-full flex-col items-center gap-[20px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[20px] shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_49.1px_0px_rgba(0,0,0,0.1)]">
    <div className="flex w-full flex-col gap-[4px]">
      <p className="text-caption invisible text-[#bfbfbf]">최근 n회 분석 기준</p>
      <div className="flex w-full items-center justify-between">
        <h3 className="text-title-semibold flex-1 text-black">자주 사용하는 말</h3>
      </div>
    </div>

    <div className="flex h-[154px] w-[290px] shrink-0 items-center justify-center">
      <p className="text-caption text-[#595959]">아직 분석된 대화가 없어요</p>
    </div>
  </section>
);

const HabitSummaryCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [summary, setSummary] = useState(null);
  const [loaded, setLoaded] = useState(false);

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
  if (!summary || !summary.analysisCount) return <EmptySummaryCard />;

  return (
    <div className="relative w-full">
      {/* 가로 스크롤 영역이 카드 그림자(blur 49px)를 자르지 않도록 위아래 여백을 그림자 크기만큼 확보 */}
      <div
        onScroll={handleScroll}
        className="no-scrollbar -mx-[24px] -my-[56px] flex snap-x snap-mandatory scroll-px-[24px] overflow-x-auto px-[24px] py-[56px]"
        style={{ gap: SLIDE_GAP }}
      >
        {SLIDES.map(({ id, render }, index) => (
          <div key={id} className="w-full shrink-0 snap-start">
            {render(index === activeIndex, summary)}
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
