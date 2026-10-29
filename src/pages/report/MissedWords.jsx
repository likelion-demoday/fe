import { useState } from "react";

import { QuoteBubble, SpeakerScoreSelector } from "../../components/feature/report/ReportBlocks";
import { SPEAKER_TONES } from "../../constants/report";

// 제목 + 화자 선택 + 선택한 화자의 대표 발화
const MissedWordsSection = ({ speakers, title, scores, quotes }) => {
  const [speaker, setSpeaker] = useState("me");

  return (
    <section className="flex w-full flex-col items-start gap-[14px]">
      <h2 className="text-[24px] leading-[34px] font-bold tracking-[0.48px] whitespace-nowrap text-[#262626]">
        {title}
      </h2>
      <SpeakerScoreSelector speakers={speakers} scores={scores} selected={speaker} onSelect={setSpeaker} />
      {quotes[speaker].map((quote, index) => (
        <QuoteBubble key={`${speaker}-${index}`} {...quote} tone={SPEAKER_TONES[speaker]} />
      ))}
    </section>
  );
};

// 놓친 말(연인·갈등) / 다시 대화(부모·자녀 갈등): 제목별 화자 선택 + 대표 발화 묶음
const MissedWords = ({ report, sections = report.conflict.missed }) => (
  <div className="flex w-full flex-col items-start gap-[30px] font-['SUIT',sans-serif]">
    {sections.map((section) => (
      <MissedWordsSection key={section.title} speakers={report.speakers} {...section} />
    ))}
  </div>
);

export default MissedWords;
