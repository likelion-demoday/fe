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
  { key: "extra", label: "추가 분석" },
];


const SECTION_CONTENT = {
  overview: { Component: OverviewSection, gap: "gap-[16px]" },
  info: { Component: ConversationInformation, gap: "gap-[20px]" },
  style: { Component: ConversationStyle, gap: "gap-[20px]" },
  interest: { Component: InterestLevel, gap: "gap-[20px]" },
  expression: { Component: BadLevel, gap: "gap-[20px]" },
  extra: { Component: PlusAnalysis, gap: "gap-[20px]" },
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
  const { Component: SectionContent, gap } = SECTION_CONTENT[section];
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

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col bg-white">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-[20px] overflow-x-hidden overflow-y-auto px-[24px] py-[16px]">
        <AppHeader />

        <div className={`flex w-full flex-col items-start ${gap}`}>
          <ReportSectionTabs sections={SECTIONS} selected={section} onSelect={setSection} />

          {section === "overview" && (
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
