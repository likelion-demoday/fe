import { Fragment, useState } from "react";

import {
  CARD_SHADOW,
  DIVIDER_GRADIENT,
  KeywordPill,
  SpeakerScoreSelector,
  SpectrumBar,
  SummaryCard,
} from "../../components/feature/report/ReportBlocks";
import { SPEAKER_TONES } from "../../constants/report";


const ExpressionAxis = ({ label, value, description, examples, tone }) => (
  <div className="flex w-full flex-col items-start gap-[8px]">
    <div className="flex min-h-[26px] w-full items-start justify-between font-bold whitespace-nowrap">
      <p className="text-[16px] tracking-[-0.32px] text-[#262626]">{label}</p>
      {value != null && <p className={`text-[20px] ${tone.text}`}>{value}%</p>}
    </div>
    <div className="flex w-full flex-col gap-[2px]">
      {value != null && <SpectrumBar position={value} tone={tone} />}
      <p className="text-[12px] leading-[18px] font-medium tracking-[0.24px] break-keep text-[#8c8c8c]">{description}</p>
    </div>
    {examples && (
      <div className="flex flex-wrap items-start gap-x-[16px] gap-y-[8px]">
        {/* 가장 많이 쓴 표현(첫 번째)만 강조 */}
        {examples.map((example, index) => (
          <KeywordPill key={example} label={example} highlighted={index === 0} />
        ))}
      </div>
    )}
  </div>
);


// 표독력 화면. 같은 구성의 애정 표현·표현 강도·갈등 표현 탭도 data/제목만 바꿔 재사용
const BadLevel = ({
  report,
  data = report.expression,
  axisTitle = "표현에서 보이는 것",
  axisCaption,
  contextTitle = "내용에서 보이는 것",
}) => {
  const [speaker, setSpeaker] = useState("me");
  const scores = { me: data.me.score, partner: data.partner.score };
  const { summary, axes, contexts } = data[speaker];
  const tone = SPEAKER_TONES[speaker];

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

      {axes.length > 0 && (
        <section className="flex w-full flex-col items-start gap-[14px]">
          <div className="flex w-full flex-col gap-[4px]">
            <h2 className="text-[24px] leading-[34px] font-bold tracking-[0.48px] text-[#262626]">{axisTitle}</h2>
            {axisCaption && (
              <p className="text-[12px] leading-[18px] font-medium tracking-[0.24px] text-[#8c8c8c]">{axisCaption}</p>
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-[20px] rounded-[16px] border border-[#eee] bg-white p-[20px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
            {axes.map((axis, index) => (
              <Fragment key={axis.label}>
                {index > 0 && <div className="h-px w-full shrink-0" style={{ backgroundImage: DIVIDER_GRADIENT }} />}
                <ExpressionAxis {...axis} tone={tone} />
              </Fragment>
            ))}
          </div>
        </section>
      )}

      {contexts.length > 0 && (
        <section className="flex w-full flex-col items-start gap-[8px]">
          <h2 className="text-[20px] font-bold whitespace-nowrap text-[#454545]">{contextTitle}</h2>
          <div className="flex w-full flex-col gap-[16px]">
            {contexts.map(({ title, description }) => (
              <div
                key={title}
                className={`flex w-full flex-col gap-[8px] overflow-clip rounded-[20px] border border-[#eee] bg-white p-[20px] ${CARD_SHADOW}`}
              >
                <p className="text-[16px] font-bold tracking-[-0.32px] text-[#262626]">{title}</p>
                <p className="text-[14px] leading-[20px] font-medium tracking-[-0.14px] break-keep text-[#595959]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BadLevel;
