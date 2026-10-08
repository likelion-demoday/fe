// 보고서 섹션들이 함께 쓰는 블록

export const CARD_SHADOW = "shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]";
export const DIVIDER_GRADIENT =
  "linear-gradient(90deg, rgba(238,238,238,0) 0%, #eee 5%, #eee 95%, rgba(238,238,238,0) 100%)";

export const KeywordPill = ({ label, highlighted = false }) => (
  <span
    className={`flex shrink-0 items-center justify-center rounded-[12px] border border-[#eee] bg-white px-[12px] py-[4px] text-[14px] leading-[22px] font-semibold tracking-[0.28px] whitespace-nowrap drop-shadow-[0px_2px_3px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)] ${
      highlighted ? "text-[#ff765b]" : "text-[#595959]"
    }`}
  >
    {label}
  </span>
);

export const ReportSection = ({ title, children }) => (
  <section className="flex w-full flex-col items-start gap-[8px]">
    <h2 className="text-[24px] leading-[34px] font-bold tracking-[0.48px] text-[#262626]">{title}</h2>
    {children}
  </section>
);

// 제목 + 설명 요약 카드
export const SummaryCard = ({ title, description }) => (
  <div className={`flex w-full flex-col gap-[8px] overflow-clip rounded-[20px] border border-[#eee] bg-white p-[20px] ${CARD_SHADOW}`}>
    <p className="text-[20px] font-bold text-[#262626]">{title}</p>
    <p className="text-[14px] leading-[20px] font-medium tracking-[-0.14px] break-keep text-[#595959]">{description}</p>
  </div>
);
