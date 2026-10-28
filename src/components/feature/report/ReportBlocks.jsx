// 보고서 섹션들이 함께 쓰는 블록
import { SPEAKER_TONES } from "../../../constants/report";

export const CARD_SHADOW = "shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]";
export const DIVIDER_GRADIENT =
  "linear-gradient(90deg, rgba(238,238,238,0) 0%, #eee 5%, #eee 95%, rgba(238,238,238,0) 100%)";

// wrap: 긴 문구(주제명 등)를 한 줄로 두지 않고 부모 폭 안에서 줄바꿈
export const KeywordPill = ({ label, highlighted = false, wrap = false }) => (
  <span
    className={`flex items-center justify-center rounded-[12px] border border-[#eee] bg-white px-[12px] py-[4px] text-[14px] leading-[22px] font-semibold tracking-[0.28px] drop-shadow-[0px_2px_3px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)] ${
      wrap ? "max-w-full text-center break-keep" : "shrink-0 whitespace-nowrap"
    } ${highlighted ? "text-[#ff765b]" : "text-[#595959]"}`}
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

// 디자인: 채워진 막대 끝보다 약 2% 앞에서 연한 배경 막대가 시작
const TRACK_OVERLAP = 2.05;

// 왼쪽에서 오른쪽으로 채워지는 막대 (position: 0~100)
export const SpectrumBar = ({ position, tone }) => {
  const fill = Math.min(100, Math.max(0, position));
  return (
    <div className="relative h-[10px] w-full drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)]">
      <div
        className={`absolute inset-y-0 right-0 rounded-r-[8px] bg-gradient-to-r to-[58.173%] ${tone.track}`}
        style={{ left: `${Math.max(0, fill - TRACK_OVERLAP)}%` }}
      />
      <div
        className={`absolute inset-y-0 left-0 rounded-[35px] bg-gradient-to-r ${tone.fill}`}
        style={{ width: `${fill}%` }}
      />
    </div>
  );
};

// 화자 선택 카드: 이름 + 점수. 선택하지 않은 쪽은 흐리게
// scores 값이 숫자면 "%"를 붙이고, 문자열이면 그대로 표시 (예: "T 87%")
export const SpeakerScoreSelector = ({ speakers, scores, selected, onSelect }) => (
  <div className="flex items-start gap-[16px]" role="tablist" aria-label="화자 선택">
    {["me", "partner"].map((key) => (
      <button
        key={key}
        type="button"
        role="tab"
        aria-selected={selected === key}
        onClick={() => onSelect(key)}
        className={`flex shrink-0 flex-col items-end gap-[12px] overflow-clip rounded-[20px] border border-[#eee] bg-white px-[18px] py-[20px] whitespace-nowrap transition-opacity ${CARD_SHADOW} ${
          selected === key ? "opacity-100" : "opacity-30"
        }`}
      >
        <span className="text-[20px] font-bold text-[#454545]">{speakers[key].nickname}</span>
        <span className={`font-['SUITE',sans-serif] text-[30px] font-bold ${SPEAKER_TONES[key].text}`}>
          {typeof scores[key] === "number" ? `${scores[key]}%` : scores[key]}
        </span>
      </button>
    ))}
  </div>
);

// 말풍선: 라벨 + 실제 한 말. 강조할 라벨은 화자 색, 나머지는 회색
export const QuoteBubble = ({ label, text, highlighted, tone }) => (
  <div
    className={`flex w-[310px] flex-col items-start gap-[8px] overflow-clip rounded-[16px] rounded-tl-none bg-white px-[20px] py-[12px] ${CARD_SHADOW}`}
  >
    <p
      className={`text-[14px] leading-[20px] font-medium tracking-[-0.14px] ${
        highlighted ? tone.text : "text-[#8c8c8c]"
      }`}
    >
      {label}
    </p>
    <p className="text-[16px] font-bold tracking-[-0.32px] break-keep text-[#454545]">“{text}”</p>
  </div>
);
