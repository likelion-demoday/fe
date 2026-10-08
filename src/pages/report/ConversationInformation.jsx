import { Fragment } from "react";

import {
  CARD_SHADOW,
  DIVIDER_GRADIENT,
  KeywordPill,
  ReportSection as Section,
} from "../../components/feature/report/ReportBlocks";

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HighlightedText = ({ text, keywords = [] }) => {
  if (keywords.length === 0) return text;

  const pattern = new RegExp(`(${keywords.map(escapeRegExp).join("|")})`);
  return text.split(pattern).map((part, index) =>
    keywords.includes(part) ? (
      <span key={index} className="font-semibold tracking-[0.28px] text-[#ff765b]">
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
};

const StatBox = ({ label, value }) => (
  <div className="flex w-[101px] flex-col items-center gap-[4px] overflow-clip rounded-[12px] bg-white px-[12px] py-[16px] whitespace-nowrap shadow-[0px_2px_6px_0px_rgba(0,0,0,0.05),0px_0px_11.4px_0px_rgba(0,0,0,0.05)]">
    <p className="text-[13px] leading-[20px] font-semibold tracking-[-0.26px] text-[#6b6b6b]">{label}</p>
    <p className="text-[24px] leading-[34px] font-bold tracking-[0.48px] text-[#454545]">{value}</p>
  </div>
);


const ConversationInformation = ({ report }) => {
  const { commonInterests, longestTopic, timeline, topicTurns, stats } = report.info;

  return (
    <div className="flex w-full flex-col items-start gap-[30px] font-['SUIT',sans-serif]">
      <Section title="대화 내용">
        <div className={`flex w-full flex-col items-start gap-[30px] overflow-clip rounded-[24px] border border-[#eee] bg-white p-[20px] ${CARD_SHADOW}`}>
          <div className="flex flex-col items-start gap-[8px]">
            <p className="text-[16px] font-bold tracking-[-0.32px] text-[#2d3038]">공통 관심사</p>
            <div className="flex flex-wrap gap-[16px]">
              {/* 가장 비중이 큰 관심사(첫 번째)만 강조 */}
              {commonInterests.map((interest, index) => (
                <KeywordPill key={interest} label={interest} highlighted={index === 0} />
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-[8px]">
            <p className="text-[16px] font-bold tracking-[-0.32px] text-[#2d3038]">가장 오래 대화한 이야기</p>
            <p className="text-[13px] leading-[20px] font-semibold tracking-[-0.26px] text-[#8c8c8c]">
              {longestTopic.title} · {longestTopic.duration}
            </p>
            <p className="text-[14px] leading-[20px] font-medium tracking-[-0.14px] break-keep text-[#595959]">
              {longestTopic.description}
            </p>
          </div>
        </div>
      </Section>

      <Section title="대화 타임라인">
        <div className="flex w-full flex-col items-start gap-[16px] rounded-[24px] border border-[#eee] bg-white p-[20px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
          {timeline.map(({ time, title, description, keywords }, index) => (
            <Fragment key={time}>
              {index > 0 && (
                <div className="h-px w-full shrink-0" style={{ backgroundImage: DIVIDER_GRADIENT }} />
              )}
              <div className="flex w-full items-start gap-[16px]">
                <span className="w-[64px] shrink-0 rounded-[55px] bg-[#f5f5f5] p-[8px] text-center text-[13px] leading-[20px] font-semibold tracking-[-0.26px] text-[#454545]">
                  {time}
                </span>
                <div className="flex min-w-px flex-1 flex-col items-start gap-[6px]">
                  <p className="text-[16px] font-bold tracking-[-0.32px] text-black">{title}</p>
                  <p className="text-[14px] leading-[20px] font-medium tracking-[-0.14px] break-keep text-[#595959]">
                    <HighlightedText text={description} keywords={keywords} />
                  </p>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </Section>

      <Section title="주제별 대화 턴 수">
        <div className={`grid w-full grid-cols-[repeat(2,fit-content(100%))] gap-[20px] overflow-clip rounded-[16px] border border-[#eee] bg-white px-[20px] pt-[20px] pb-[16px] ${CARD_SHADOW}`}>
          {topicTurns.map(({ topic, turns }) => (
            <div key={topic} className="flex flex-col items-end gap-[2px] self-start justify-self-start">
              <KeywordPill label={topic} />
              <p className="text-[13px] leading-[20px] font-semibold tracking-[-0.26px] whitespace-nowrap text-[#ff765b]">
                {turns}턴
              </p>
            </div>
          ))}
        </div>
      </Section>

      <div className="flex w-full items-start justify-between">
        <StatBox label="녹음 시간" value={stats.recordingTime} />
        <StatBox label="대화 턴" value={`${stats.turns}턴`} />
        <StatBox label="주제" value={`${stats.topicCount}개`} />
      </div>
    </div>
  );
};

export default ConversationInformation;
