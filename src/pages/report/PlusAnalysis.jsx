import { useState } from "react";

import { CARD_SHADOW, SpeakerScoreSelector } from "../../components/feature/report/ReportBlocks";
import { SPEAKER_TONES } from "../../constants/report";

// 말풍선: 반응 유형 + 실제 한 말. 주 유형 반응은 화자 색, 반대 유형은 회색
const QuoteBubble = ({ type, text, highlighted, tone }) => (
  <div
    className={`flex w-[310px] flex-col items-start gap-[8px] overflow-clip rounded-[16px] rounded-tl-none bg-white px-[20px] py-[12px] ${CARD_SHADOW}`}
  >
    <p
      className={`text-[14px] leading-[20px] font-medium tracking-[-0.14px] ${
        highlighted ? tone.text : "text-[#8c8c8c]"
      }`}
    >
      {type}형 반응
    </p>
    <p className="text-[16px] font-bold tracking-[-0.32px] break-keep text-[#454545]">“{text}”</p>
  </div>
);

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
          {...quote}
          highlighted={quote.type === type}
          tone={SPEAKER_TONES[speaker]}
        />
      ))}
    </section>
  );
};

export default PlusAnalysis;
