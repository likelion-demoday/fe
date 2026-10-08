import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { mockReportDetail } from "../../mocks/reportDetail";
import { shareCurrentPage } from "../../utils/share";

const SECTIONS = [
  { key: "overview", label: "한번에 보기" },
  { key: "info", label: "대화 정보" },
  { key: "style", label: "대화 방식" },
  { key: "interest", label: "관심도" },
  { key: "expression", label: "표독력" },
  { key: "extra", label: "추가 분석" },
];

// gap: 섹션 제목 탭과 본문 사이 간격 (디자인 기준)
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

const ReportPage = ({ report = mockReportDetail }) => {
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const { Component: SectionContent, gap } = SECTION_CONTENT[section];

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col bg-white">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-[20px] overflow-x-hidden overflow-y-auto px-[24px] py-[16px]">
        <AppHeader />

        <div className={`flex w-full flex-col items-start ${gap}`}>
          <ReportSectionTabs sections={SECTIONS} selected={section} onSelect={setSection} />

          {section === "overview" && (
            <div className="flex items-center gap-[8px]">
              <p className="font-['SUIT',sans-serif] text-[13px] leading-[20px] font-semibold tracking-[-0.26px] whitespace-pre text-[#8c8c8c]">
                {`${report.date}  ·  ${report.duration} 녹음`}
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
