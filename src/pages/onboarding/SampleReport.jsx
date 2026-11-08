import { useRef, useState } from "react";
import Button from "../../components/common/Button";
import TextBackButton from "../../components/common/TextBackButton";
import OverviewSection from "../../components/feature/report/OverviewSection";
import ReportSectionTabs from "../../components/feature/report/ReportSectionTabs";
import ConversationInformation from "../report/ConversationInformation";
import ConversationStyle from "../report/ConversationStyle";
import InterestLevel from "../report/InterestLevel";
import BadLevel from "../report/BadLevel";
import MissedWords from "../report/MissedWords";
import { CONFLICT_INFO_LABELS, PERCENT_METRIC_CAPTION } from "../../constants/report";
import { sampleReport } from "../../mocks/sampleReport";
import "./introduction.css";

const sections = [
  { key: "overview", label: "한번에 보기", Component: OverviewSection },
  { key: "info", label: "갈등 정보", Component: ConversationInformation, props: { labels: CONFLICT_INFO_LABELS } },
  { key: "style", label: "대화 방식", Component: ConversationStyle },
  { key: "reaction", label: "갈등 반응", Component: InterestLevel, props: { data: sampleReport.conflict.reaction, title: "서로의 갈등 반응", largeScore: true } },
  { key: "intensity", label: "표현 강도", Component: BadLevel, props: { data: sampleReport.conflict.intensity, axisTitle: "갈등 표현에서 보이는 것", axisCaption: PERCENT_METRIC_CAPTION } },
  { key: "missed", label: "추가 분석", Component: MissedWords },
  { key: "coaching", label: "대화 개선", Component: MissedWords, props: { sections: sampleReport.conflict.coaching } },
];

export default function SampleReport({ onBack, onComplete }) {
  const [section, setSection] = useState("overview");
  const scrollRef = useRef(null);
  const { Component, props } = sections.find(({ key }) => key === section);
  return (
    <main className="relative mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden bg-white">
      <div ref={scrollRef} className="sample-report-scroll no-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-[24px] pt-[16px]">
        <header className="mb-[24px] flex flex-col items-start gap-[16px]">
          <p className="font-['SUIT',sans-serif] text-[20px] font-extrabold tracking-[-0.8px] text-black">RE<span className="text-[#ff765b]">:S</span>AY</p>
          <TextBackButton onClick={onBack} />
          <div><h1 className="text-heading">샘플 보고서</h1><p className="text-caption mt-[6px] text-[#8c8c8c]">서비스 체험을 위해 구성한 예시 데이터예요.</p></div>
        </header>
        <div className="flex flex-col gap-[20px]">
          <ReportSectionTabs sections={sections} selected={section} onSelect={(key) => { setSection(key); scrollRef.current?.scrollTo({ top: 0 }); }} />
          <p className="text-caption text-[#8c8c8c]">{sampleReport.duration} 녹음 · {sampleReport.type} · {sampleReport.relation}</p>
          <Component key={section} report={sampleReport} {...props} />
        </div>
      </div>
      <footer className="sample-report-footer absolute inset-x-0 bottom-0 z-10 px-[16px] pt-[10px] pb-[max(30px,env(safe-area-inset-bottom))]">
        <Button text="다음" onClick={onComplete} className="flex w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#262626] active:bg-[#595959] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] text-white" />
      </footer>
    </main>
  );
}
