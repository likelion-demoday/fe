import { useState, useEffect } from "react";

import FrequentWordsCard from "./FrequentWordsCard";
import SpeakingSpeedCard from "./SpeakingSpeedCard";
import ProfanityRateCard from "./ProfanityRateCard";
import HabitHistoryCard from "./HabitHistoryCard";

import { getAnalysisSummary } from "../../../api/analysis";

const TOTAL_CARDS = 4;
const SLIDE_GAP = 24;

const SLIDES = [
  { id: "frequent-words", render: (active, summary) => <FrequentWordsCard active={active} summary={summary} /> },
  { id: "speaking-speed", render: (active, summary) => <SpeakingSpeedCard active={active} summary={summary} /> },
  { id: "profanity-rate", render: (active, summary) => <ProfanityRateCard active={active} summary={summary} /> },
  { id: "habit-history", render: (active, summary) => <HabitHistoryCard active={active} summary={summary} /> },
];

const HabitSummaryCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [summary, setSummary] = useState(null);

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
      }
    }

    fetchSummary();
  },[])

  if (!summary) return null;

  return (
    <div className="relative w-full">
      <div
        onScroll={handleScroll}
        className="no-scrollbar -mx-[24px] -my-[24px] flex snap-x snap-mandatory scroll-px-[24px] overflow-x-auto px-[24px] py-[24px]"
        style={{ gap: SLIDE_GAP }}
      >
        {SLIDES.map(({ id, render }, index) => (
          <div key={id} className="w-full shrink-0 snap-start">
            {render(index === activeIndex)}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-[20px] left-1/2 flex -translate-x-1/2 items-center gap-[12px]">
        {Array.from({ length: TOTAL_CARDS }, (_, index) => (
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
