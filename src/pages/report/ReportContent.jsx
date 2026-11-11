import { useRef, useState } from "react";

import ReportSectionTabs from "../../components/feature/report/ReportSectionTabs";
import OverviewSection from "../../components/feature/report/OverviewSection";
import ConversationInformation from "./ConversationInformation";
import ConversationStyle from "./ConversationStyle";
import InterestLevel from "./InterestLevel";
import BadLevel from "./BadLevel";
import PlusAnalysis from "./PlusAnalysis";
import MissedWords from "./MissedWords";
import dailyIcon from "../../assets/icons/analysis-type-daily-s.svg";
import relationMainIcon from "../../assets/icons/relation-main-s.svg";
import { CONFLICT_INFO_LABELS, PARENT_CONFLICT_INFO_LABELS, PERCENT_METRIC_CAPTION } from "../../constants/report";

const SECTIONS = [
  { key: "overview", label: "한번에 보기" },
  { key: "info", label: "대화 정보" },
  { key: "conflictInfo", label: "갈등 정보" },
  { key: "conflictFlow", label: "갈등 흐름" },
  { key: "style", label: "대화 방식" },
  { key: "parentStyle", label: "대화 방식" },
  { key: "interest", label: "관심도" },
  { key: "expression", label: "표독력" },
  { key: "affection", label: "애정 표현" },
  { key: "conflictReaction", label: "갈등 반응" },
  { key: "intensity", label: "표현 강도" },
  { key: "missedWords", label: "추가 분석" },
  { key: "coaching", label: "대화 개선" },
  { key: "questionAdvice", label: "질문·조언" },
  { key: "conflictExpression", label: "갈등 표현" },
  { key: "retry", label: "추가 분석" },
  { key: "parentCoaching", label: "대화 개선" },
  { key: "extra", label: "추가 분석" },
];

// relationshipType(scenario)별로 보여줄 탭
const SCENARIO_SECTIONS = {
  FRIEND_DAILY: ["overview", "info", "style", "interest", "expression", "extra"],
  COUPLE_DAILY: ["overview", "info", "style", "interest", "affection", "extra"],
  COUPLE_CONFLICT: ["overview", "conflictInfo", "style", "conflictReaction", "intensity", "missedWords", "coaching"],
  PARENT_CHILD_CONFLICT: ["overview", "conflictFlow", "parentStyle", "questionAdvice", "conflictExpression", "retry", "parentCoaching"],
};

const SECTION_CONTENT = {
  overview: { Component: OverviewSection, gap: "gap-[16px]" },
  info: { Component: ConversationInformation, gap: "gap-[20px]" },
  style: { Component: ConversationStyle, gap: "gap-[20px]" },
  interest: { Component: InterestLevel, gap: "gap-[20px]" },
  expression: { Component: BadLevel, gap: "gap-[20px]" },
  extra: { Component: PlusAnalysis, gap: "gap-[20px]" },
  // 연인·일상 전용 탭 (데이터: report.affection)
  affection: {
    Component: ({ report }) => (
      <BadLevel
        report={report}
        data={report.affection}
        axisTitle="애정 표현에서 보이는 것"
        axisCaption={PERCENT_METRIC_CAPTION}
        contextTitle="둘만의 패턴에서 보이는 것"
      />
    ),
    gap: "gap-[20px]",
  },
  // 연인·갈등 전용 탭 (데이터: report.conflict)
  conflictInfo: {
    Component: ({ report }) => <ConversationInformation report={report} labels={CONFLICT_INFO_LABELS} />,
    gap: "gap-[20px]",
  },
  conflictReaction: {
    Component: ({ report }) => (
      <InterestLevel report={report} data={report.conflict.reaction} title="서로의 갈등 반응" largeScore />
    ),
    gap: "gap-[20px]",
  },
  intensity: {
    Component: ({ report }) => (
      <BadLevel
        report={report}
        data={report.conflict.intensity}
        axisTitle="갈등 표현에서 보이는 것"
        axisCaption={PERCENT_METRIC_CAPTION}
      />
    ),
    gap: "gap-[20px]",
  },
  missedWords: { Component: MissedWords, gap: "gap-[20px]" },
  coaching: {
    Component: ({ report }) => <MissedWords report={report} sections={report.conflict.coaching} />,
    gap: "gap-[20px]",
  },
  // 부모·자녀 갈등 전용 탭 (데이터: report.parentConflict)
  conflictFlow: {
    Component: ({ report }) => <ConversationInformation report={report} labels={PARENT_CONFLICT_INFO_LABELS} />,
    gap: "gap-[20px]",
  },
  parentStyle: {
    Component: ({ report }) => <ConversationStyle report={report} expressionTitle="갈등 중 표현 습관" />,
    gap: "gap-[20px]",
  },
  questionAdvice: {
    Component: ({ report }) => (
      <InterestLevel report={report} data={report.parentConflict.questionAdvice} title="질문과 조언" largeScore />
    ),
    gap: "gap-[20px]",
  },
  conflictExpression: {
    Component: ({ report }) => (
      <BadLevel
        report={report}
        data={report.parentConflict.conflictExpression}
        axisTitle="갈등 표현에서 보이는 것"
        axisCaption={PERCENT_METRIC_CAPTION}
      />
    ),
    gap: "gap-[20px]",
  },
  retry: {
    Component: ({ report }) => <MissedWords report={report} sections={report.parentConflict.retry} />,
    gap: "gap-[20px]",
  },
  parentCoaching: {
    Component: ({ report }) => <MissedWords report={report} sections={report.parentConflict.coaching} />,
    gap: "gap-[20px]",
  },
};

const TagChip = ({ icon, label }) => (
  <span className="flex shrink-0 items-center justify-center gap-[2px] rounded-[12px] bg-white p-[8px] drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)]">
    {icon}
    <span className="text-[13px] font-medium tracking-[0.39px] whitespace-nowrap text-black">{label}</span>
  </span>
);

// 보고서 탭 + 본문. 내 보고서(ReportPage)와 공유 보고서(SharePage)에서 함께 사용
const ReportContent = ({ report, onUnlockCharacter, onShareCharacter }) => {
  const [section, setSection] = useState("overview");
  const contentRef = useRef(null);
  const gesture = useRef(null);
  const sectionKeys = SCENARIO_SECTIONS[report.scenario] ?? SCENARIO_SECTIONS.FRIEND_DAILY;
  const sections = SECTIONS.filter(({ key }) => sectionKeys.includes(key));
  // 다른 시나리오 보고서로 넘어왔을 때 없는 탭이 선택돼 있으면 처음 탭으로
  const currentSection = sectionKeys.includes(section) ? section : "overview";
  const { Component: SectionContent, gap } = SECTION_CONTENT[currentSection];

  const handleTouchStart = (event) => {
    gesture.current = null;
    // 입력 조작과 여러 손가락으로 확대하는 동작은 탭 전환에서 제외합니다.
    if (event.touches.length !== 1 || event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    const touch = event.touches[0];
    gesture.current = { id: touch.identifier, x: touch.clientX, y: touch.clientY, direction: null };
  };

  const handleTouchMove = (event) => {
    const start = gesture.current;
    if (!start) return;
    if (event.touches.length !== 1) { gesture.current = null; return; }
    const touch = event.touches[0];
    const dx = Math.abs(touch.clientX - start.x);
    const dy = Math.abs(touch.clientY - start.y);
    if (!start.direction && Math.max(dx, dy) >= 10) {
      start.direction = dx > dy * 1.5 ? "horizontal" : "vertical";
    }
  };

  const handleTouchEnd = (event) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.direction === "vertical") return;
    const touch = Array.from(event.changedTouches).find(({ identifier }) => identifier === start.id);
    if (!touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
    const index = sections.findIndex(({ key }) => key === currentSection);
    const next = sections[index + (dx < 0 ? 1 : -1)];
    if (!next) return;
    setSection(next.key);
    // 깊이 스크롤한 상태에서도 새 섹션을 처음부터 보여줍니다.
    contentRef.current?.parentElement?.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div ref={contentRef} className={`flex w-full flex-col items-start ${gap}`}>
      <ReportSectionTabs sections={sections} selected={currentSection} onSelect={setSection} />

      <div
        className={`flex w-full touch-pan-y touch-pinch-zoom flex-col items-start ${gap}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { gesture.current = null; }}
      >
      {currentSection === "overview" && (
        <div className="flex items-center gap-[8px]">
          <p className="font-['SUIT',sans-serif] text-[13px] leading-[20px] font-semibold tracking-[-0.26px] whitespace-pre text-[#8c8c8c]">
            {`${report.duration} 녹음`}
          </p>
          <div className="flex items-center gap-[6px]">
            <TagChip
              icon={<img src={dailyIcon} alt="" className="block size-[20px] max-w-none shrink-0" />}
              label={report.type}
            />
            <TagChip
              icon={
                <span className="relative size-[20px] shrink-0 overflow-clip">
                  <img
                    src={relationMainIcon}
                    alt=""
                    className="absolute top-[calc(50%-0.31px)] left-1/2 block h-[15.625px] w-[13.75px] max-w-none -translate-x-1/2 -translate-y-1/2"
                  />
                </span>
              }
              label={report.relation}
            />
          </div>
        </div>
      )}

      <SectionContent report={report} onUnlockCharacter={onUnlockCharacter} onShareCharacter={onShareCharacter} />
      </div>
    </div>
  );
};

export default ReportContent;
