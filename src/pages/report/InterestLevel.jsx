import { useState } from "react";

import {
  KeywordPill,
  ReportSection,
  SpeakerScoreSelector,
  SummaryCard,
} from "../../components/feature/report/ReportBlocks";

const DETAIL_CARD =
  "flex w-full flex-col items-start rounded-[20px] border border-[#eee] bg-white p-[20px] drop-shadow-[0px_0px_10px_rgba(0,0,0,0.07)] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.05)]";

const InterestItem = ({ title, count, description, examples }) => (
  <div className="flex w-full flex-col items-start gap-[8px]">
    <div className="flex w-full items-center justify-between whitespace-nowrap">
      <p className="text-[16px] font-bold tracking-[-0.32px] text-[#2d3038]">{title}</p>
      <p className="text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#ff765b]">총 {count}회</p>
    </div>
    <p className="text-[12px] leading-[18px] font-medium tracking-[0.24px] break-keep text-[#6b6b6b]">{description}</p>
    {examples.length > 0 && (
      <div className="flex flex-wrap items-start gap-x-[16px] gap-y-[8px]">
        {/* 첫 번째 예시를 대표 예시로 강조 */}
        {examples.map((example, index) => (
          <KeywordPill key={example} label={example} highlighted={index === 0} />
        ))}
      </div>
    )}
  </div>
);


const InterestGroup = ({ title, summary, children }) => (
  <div className="flex w-full flex-col items-start gap-[8px]">
    <p className="text-[20px] font-bold whitespace-nowrap text-[#454545]">{title}</p>
    <div className="flex w-full flex-col gap-[12px]">
      {children}
      {summary && <SummaryCard {...summary} />}
    </div>
  </div>
);


// 관심도 화면. 같은 구성의 갈등 반응 탭도 data/제목만 바꿔 재사용
const InterestLevel = ({ report, data = report.interest, title = "관심을 보인 방식" }) => {
  const [speaker, setSpeaker] = useState("me");
  const scores = { me: data.me.score, partner: data.partner.score };
  const { summary, groups, chips } = data[speaker];

  return (
    <div className="flex w-full flex-col items-start gap-[30px] font-['SUIT',sans-serif]">
      <div className="flex w-full flex-col items-start gap-[10px]">
        <SpeakerScoreSelector
          speakers={report.speakers}
          scores={scores}
          selected={speaker}
          onSelect={setSpeaker}
        />
        <SummaryCard {...summary} />
      </div>

      <ReportSection title={title}>
        <div className="flex w-full flex-col items-start gap-[30px]">
          {groups.map(({ title, items, summary: groupSummary }) => (
            <InterestGroup key={title} title={title} summary={groupSummary}>
              <div className={`${DETAIL_CARD} gap-[30px]`}>
                {items.map((item) => (
                  <InterestItem key={item.title} {...item} />
                ))}
              </div>
            </InterestGroup>
          ))}

          {(chips.summary || chips.items.length > 0) && (
            <InterestGroup title={chips.title} summary={chips.summary}>
              {chips.items.length > 0 && (
                <div className={`${DETAIL_CARD} gap-[12px]`}>
                  <p className="text-[12px] leading-[18px] font-medium tracking-[0.24px] text-[#6b6b6b]">
                    {chips.caption}
                  </p>
                  <div className="grid w-full grid-cols-2 gap-[10px] text-[14px] leading-[22px] font-semibold tracking-[0.28px] whitespace-nowrap">
                    {chips.items.map(({ label, count }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-[12px] bg-white px-[12px] py-[8px] drop-shadow-[0px_2px_3px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)]"
                      >
                        <span className="text-[#2d3038]">{label}</span>
                        <span className="text-[#ff765b]">{count}회</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </InterestGroup>
          )}
        </div>
      </ReportSection>
    </div>
  );
};

export default InterestLevel;
