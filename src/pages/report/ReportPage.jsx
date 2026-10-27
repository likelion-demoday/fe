import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAnalysisReport } from "../../api/analysis";

import AppHeader from "../../components/common/AppHeader";
import { SheetButton } from "../../components/common/BottomSheet";
import ReportSectionTabs from "../../components/feature/report/ReportSectionTabs";
import OverviewSection from "../../components/feature/report/OverviewSection";
import ConversationInformation from "./ConversationInformation";
import ConversationStyle from "./ConversationStyle";
import InterestLevel from "./InterestLevel";
import BadLevel from "./BadLevel";
import PlusAnalysis from "./PlusAnalysis";
import ScenarioInsight from "./ScenarioInsight";
import dailyIcon from "../../assets/icons/analysis-type-daily-s.svg";
import relationMainIcon from "../../assets/icons/relation-main-s.svg";
import { mockAnalysisReportResponse } from "../../mocks/analysisReportResponse";
import { toReportView } from "../../utils/reportMapper";
import { shareCurrentPage } from "../../utils/share";

const STATUS_MESSAGES = {
  ANALYZING: "아직 분석 중이에요. 잠시 후 다시 확인해 주세요.",
  FAILED: "분석에 실패했어요.",
};

const fetchReport = (reportId) =>
  import.meta.env.DEV && reportId === "mock"
    ? Promise.resolve(mockAnalysisReportResponse)
    : getAnalysisReport(reportId);

const SECTIONS = [
  { key: "overview", label: "한번에 보기" },
  { key: "info", label: "대화 정보" },
  { key: "style", label: "대화 방식" },
  { key: "interest", label: "관심도" },
  { key: "expression", label: "표독력" },
  { key: "affection", label: "애정 표현" },
  { key: "conflictReaction", label: "갈등 반응" },
  { key: "intensity", label: "표현 강도" },
  { key: "missedWords", label: "놓친 말" },
  { key: "attachment", label: "애착 유형" },
  { key: "questionAdvice", label: "질문/조언" },
  { key: "conflictExpression", label: "갈등 표현" },
  { key: "retry", label: "다시 대화" },
  { key: "extra", label: "추가 분석" },
];

// relationshipType(scenario)별로 보여줄 탭
const SCENARIO_SECTIONS = {
  FRIEND_DAILY: ["overview", "info", "style", "interest", "expression", "extra"],
  COUPLE_DAILY: ["overview", "info", "style", "interest", "affection", "extra"],
  COUPLE_CONFLICT: ["overview", "info", "style", "conflictReaction", "intensity", "missedWords", "attachment"],
  PARENT_CHILD_CONFLICT: ["overview", "info", "style", "questionAdvice", "conflictExpression", "retry"],
};

// 시나리오 전용 탭: 탭 제목 + 보여줄 scenarioInsights 카테고리
const scenarioSection = (title, categories) => ({
  Component: ({ report }) => <ScenarioInsight report={report} title={title} categories={categories} />,
  gap: "gap-[20px]",
});

const SECTION_CONTENT = {
  overview: { Component: OverviewSection, gap: "gap-[16px]" },
  info: { Component: ConversationInformation, gap: "gap-[20px]" },
  style: { Component: ConversationStyle, gap: "gap-[20px]" },
  interest: { Component: InterestLevel, gap: "gap-[20px]" },
  expression: { Component: BadLevel, gap: "gap-[20px]" },
  extra: { Component: PlusAnalysis, gap: "gap-[20px]" },
  affection: scenarioSection("애정 표현", ["AFFECTION_EXPRESSION"]),
  conflictReaction: scenarioSection("갈등 반응", ["CONFLICT_POSITION", "CONFLICT_TOPIC"]),
  // TODO: 표현 강도 전용 화면 전까지 표독력 화면 재사용 (같은 spicinessInsights 데이터)
  intensity: { Component: BadLevel, gap: "gap-[20px]" },
  missedWords: scenarioSection("놓친 말", ["MISSED_SIGNAL"]),
  // TODO: 애착 유형은 API에 대응 데이터 없음
  attachment: scenarioSection("애착 유형", []),
  questionAdvice: scenarioSection("질문/조언", ["QUESTION_RESPONSE_STYLE", "CONVERSATION_OPENNESS"]),
  conflictExpression: scenarioSection("갈등 표현", ["CONFLICT_TOPIC", "CONFLICT_POSITION", "CARE_EXPRESSION"]),
  retry: scenarioSection("다시 대화", ["SOLUTION", "TURNING_POINT"]),
};

const TagChip = ({ icon, label }) => (
  <span className="flex shrink-0 items-center justify-center gap-[2px] rounded-[12px] bg-white p-[8px] drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)]">
    {icon}
    <span className="text-[13px] font-medium tracking-[0.39px] whitespace-nowrap text-black">{label}</span>
  </span>
);

const ReportPage = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [section, setSection] = useState("overview");
  const [loaded, setLoaded] = useState({ id: null, report: null, message: null });
  const isCurrent = loaded.id === reportId;
  const report = isCurrent ? loaded.report : null;
  const message = isCurrent ? loaded.message : null;

  useEffect(() => {
    let cancelled = false;
    const finish = (next) => {
      if (!cancelled) setLoaded({ id: reportId, report: null, message: null, ...next });
    };

    fetchReport(reportId)
      .then((result) => {
        if (result.status === "COMPLETED" && result.report) {
          finish({ report: toReportView(result.report) });
        } else {
          finish({ message: STATUS_MESSAGES[result.status] ?? STATUS_MESSAGES.FAILED });
        }
      })
      .catch((e) => finish({ message: e.message ?? "보고서를 불러오지 못했어요." }));

    return () => {
      cancelled = true;
    };
  }, [reportId]);

  if (!report) {
    return (
      <main className="mx-auto flex h-[844px] w-[390px] flex-col bg-white px-[24px] py-[16px]">
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-[20px]">
          <p className="text-title-medium text-center text-[#595959]">{message ?? "보고서를 불러오는 중이에요"}</p>
          {message && (
            <div className="flex w-full">
              <SheetButton text="홈으로" onClick={() => navigate("/home")} />
            </div>
          )}
        </div>
      </main>
    );
  }

  const sectionKeys = SCENARIO_SECTIONS[report.scenario] ?? SCENARIO_SECTIONS.FRIEND_DAILY;
  const sections = SECTIONS.filter(({ key }) => sectionKeys.includes(key));
  // 다른 시나리오 보고서로 넘어왔을 때 없는 탭이 선택돼 있으면 처음 탭으로
  const currentSection = sectionKeys.includes(section) ? section : "overview";
  const { Component: SectionContent, gap } = SECTION_CONTENT[currentSection];

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col bg-white">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-[20px] overflow-x-hidden overflow-y-auto px-[24px] py-[16px]">
        <AppHeader />

        <div className={`flex w-full flex-col items-start ${gap}`}>
          <ReportSectionTabs sections={sections} selected={currentSection} onSelect={setSection} />

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

          <SectionContent report={report} />
        </div>
      </div>

      <div className="flex w-full shrink-0 gap-[12px] bg-white px-[20px] py-[30px]">
        <SheetButton text="공유하기" onClick={() => shareCurrentPage("RE:SAY 대화 분석 보고서")} />
        <SheetButton text="완료" onClick={() => navigate("/home")} />
      </div>
    </main>
  );
};

export default ReportPage;
