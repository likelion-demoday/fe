import { useState } from "react";

import { QuoteBubble, SpeakerScoreSelector } from "../../components/feature/report/ReportBlocks";
import { SPEAKER_TONES } from "../../constants/report";

// 추가 분석: 화자별 T/F 유형과 대표 반응
const PlusAnalysis = ({ report }) => {
  const [speaker, setSpeaker] = useState("me");
  const { tf } = report;
  const scores = {
    me: `${tf.me.type} ${tf.me.percent}%`,
    partner: `${tf.partner.type} ${tf.partner.percent}%`,
  };
  const { type, quotes } = tf[speaker];

  return (
    <section className="flex w-full flex-col items-start gap-[14px] font-['SUIT',sans-serif]">
      <h2 className="text-[24px] leading-[34px] font-bold tracking-[0.48px] whitespace-nowrap text-[#262626]">
        T/F 유형
      </h2>
      <SpeakerScoreSelector
        speakers={report.speakers}
        scores={scores}
        selected={speaker}
        onSelect={setSpeaker}
      />
      {quotes.map((quote, index) => (
        <QuoteBubble
          key={`${speaker}-${index}`}
          label={`${quote.type}형 반응`}
          text={quote.text}
          highlighted={quote.type === type}
          tone={SPEAKER_TONES[speaker]}
        />
      ))}
    </section>
  );
};

export default PlusAnalysis;
