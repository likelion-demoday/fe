import { Fragment, useState } from "react";

import {
  CARD_SHADOW,
  DIVIDER_GRADIENT,
  KeywordPill,
  ReportSection,
  SpectrumBar,
  SummaryCard,
} from "../../components/feature/report/ReportBlocks";
import { SPEAKER_TONES } from "../../constants/report";

const HIGHLIGHT_OVER = 5;

const SpeakerSelector = ({ speakers, selected, onSelect }) => (
  <div className="flex w-full items-center justify-center gap-[16px]" role="tablist" aria-label="화자 선택">
    {["me", "partner"].map((key) => (
      <button
        key={key}
        type="button"
        role="tab"
        aria-selected={selected === key}
        onClick={() => onSelect(key)}
        className={`flex min-w-px flex-1 flex-col items-center overflow-clip rounded-[20px] border border-[#eee] bg-white px-[18px] py-[36px] transition-opacity ${CARD_SHADOW} ${
          selected === key ? "opacity-100" : "opacity-30"
        }`}
      >
        <span className={`text-[20px] font-bold whitespace-nowrap ${SPEAKER_TONES[key].text}`}>
          {speakers[key].nickname}
        </span>
      </button>
    ))}
  </div>
);

const ExpressionPill = ({ word, count }) => {
  const highlighted = count > HIGHLIGHT_OVER;
  return (
    <div className="flex flex-col items-end justify-center gap-[2px]">
      <KeywordPill label={word} highlighted={highlighted} />
      <p
        className={`text-[12px] leading-[18px] font-medium tracking-[0.24px] whitespace-nowrap ${
          highlighted ? "text-[#ff765b]" : "text-[#8c8c8c]"
        }`}
      >
        {count}회
      </p>
    </div>
  );
};


const ConversationStyle = ({ report }) => {
  const [speaker, setSpeaker] = useState("me");
  const { rhythm, rhythmSummary, expressions, expressionSummary } = report.style[speaker];
  const tone = SPEAKER_TONES[speaker];

  return (
    <div className="flex w-full flex-col items-start gap-[20px] font-['SUIT',sans-serif]">
      <SpeakerSelector speakers={report.speakers} selected={speaker} onSelect={setSpeaker} />

      <div className="flex w-full flex-col items-start gap-[30px]">
        <ReportSection title="말하는 리듬">
          <div className="flex w-full flex-col gap-[12px]">
            <div className={`flex w-full flex-col items-start gap-[20px] overflow-clip rounded-[24px] border border-[#eee] bg-white p-[20px] ${CARD_SHADOW}`}>
              {rhythm.map(({ label, value, position, range }, index) => (
                <Fragment key={label}>
                  {index > 0 && <div className="h-px w-full shrink-0" style={{ backgroundImage: DIVIDER_GRADIENT }} />}
                  <div className="flex w-full flex-col gap-[8px]">
                    <div className="flex w-full items-start justify-between font-bold whitespace-nowrap">
                      <p className="text-[16px] tracking-[-0.32px] text-[#2d3038]">{label}</p>
                      <p className={`text-[20px] ${tone.text}`}>{value}</p>
                    </div>
                    <div className="flex w-full flex-col gap-[2px]">
                      <SpectrumBar position={position} tone={tone} />
                      <div className="flex w-full items-start justify-between text-[13px] leading-[20px] font-semibold tracking-[-0.26px] whitespace-nowrap text-[#bfbfbf]">
                        <p>{range[0]}</p>
                        <p>{range[1]}</p>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <SummaryCard {...rhythmSummary} />
          </div>
        </ReportSection>

        <ReportSection title="자주 쓰는 표현">
          <div className="flex w-full flex-col gap-[12px]">
            <div className="flex w-full flex-col items-start gap-[20px] rounded-[20px] border border-[#eee] bg-white p-[20px] drop-shadow-[0px_0px_10px_rgba(0,0,0,0.07)] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.05)]">
              {expressions.map(({ category, items }) => (
                <div key={category} className="flex flex-col items-start gap-[8px]">
                  <p className="text-[16px] font-bold tracking-[-0.32px] whitespace-nowrap text-[#2d3038]">{category}</p>
                  <div className="flex flex-wrap items-start gap-[16px]">
                    {items.map((item) => (
                      <ExpressionPill key={item.word} {...item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <SummaryCard {...expressionSummary} />
          </div>
        </ReportSection>
      </div>
    </div>
  );
};

export default ConversationStyle;
