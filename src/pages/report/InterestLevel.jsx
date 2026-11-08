import { useState } from "react";

import {
  CARD_SHADOW,
  CHIP_SHADOW,
  DETAIL_CARD_SHADOW,
  KeywordPill,
  ReportSection,
  SpeakerScoreSelector,
  SummaryCard,
} from "../../components/feature/report/ReportBlocks";

const DETAIL_CARD = "flex w-full flex-col items-start rounded-[20px] border border-[#eee] bg-white p-[20px]";

const InterestItem = ({ title, count, description, examples }) => (
  <div className="flex w-full flex-col items-start gap-[8px]">
    <div className="flex w-full items-center justify-between whitespace-nowrap">
      <p className="text-[16px] font-bold tracking-[-0.32px] text-[#2d3038]">{title}</p>
      <p className="text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#ff765b]">총 {count}회</p>
    </div>
    <p className="text-[12px] leading-[18px] font-medium tracking-[0.24px] break-keep text-[#6b6b6b]">{description}</p>
    {examples.length > 0 && (
      <div className="flex flex-wrap items-start gap-x-[16px] gap-y-[8px]">
        {/* 실제 발화 문장이라 강조 없이 왼쪽 정렬, 길면 줄바꿈. 같은 문장이 반복될 수 있어 index로 key */}
        {examples.map((example, index) => (
          <KeywordPill key={index} label={example} wrap alignLeft />
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
const InterestLevel = ({ report, data = report.interest, title = "관심을 보인 방식", largeScore = false }) => {
  const [speaker, setSpeaker] = useState("me");
  const scores = { me: data.me.score, partner: data.partner.score };
  const { summary, groups, chips } = data[speaker];
  // 친구 일상만 그림자 2번, 나머지 대화 유형은 기존 그림자 유지
  const detailCardClass = `${DETAIL_CARD} ${report.scenario === "FRIEND_DAILY" ? CARD_SHADOW : DETAIL_CARD_SHADOW}`;

  return (
    <div className="flex w-full flex-col items-start gap-[30px] font-['SUIT',sans-serif]">
      <div className="flex w-full flex-col items-start gap-[10px]">
        <SpeakerScoreSelector
          speakers={report.speakers}
          scores={scores}
          selected={speaker}
          onSelect={setSpeaker}
          largeScore={largeScore}
        />
        <SummaryCard {...summary} />
      </div>

      <ReportSection title={title}>
        <div className="flex w-full flex-col items-start gap-[30px]">
          {groups.map(({ title, items, summary: groupSummary }) => (
            <InterestGroup key={title} title={title} summary={groupSummary}>
              <div className={`${detailCardClass} gap-[30px]`}>
                {items.map((item) => (
                  <InterestItem key={item.title} {...item} />
                ))}
              </div>
            </InterestGroup>
          ))}

          {(chips.summary || chips.items.length > 0) && (
            <InterestGroup title={chips.title} summary={chips.summary}>
              {chips.items.length > 0 && (
                <div className={`${detailCardClass} gap-[12px]`}>
                  <p className="text-[12px] leading-[18px] font-medium tracking-[0.24px] text-[#6b6b6b]">
                    {chips.caption}
                  </p>
                  <div className="grid w-full grid-cols-2 gap-[10px] text-[14px] leading-[22px] font-semibold tracking-[0.28px] whitespace-nowrap">
                    {chips.items.map(({ label, count }) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between rounded-[12px] bg-white px-[12px] py-[8px] ${CHIP_SHADOW}`}
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
