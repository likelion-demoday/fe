import { ReportSection, SummaryCard } from "../../components/feature/report/ReportBlocks";

// TODO: 시나리오 전용 탭 임시 화면. 디자인의 %·횟수·예시 발화는 API에 없어서 scenarioInsights 제목·설명만 표시
const ScenarioInsight = ({ report, title, categories }) => {
  const insights = report.scenarioInsights.filter(({ category }) => categories.includes(category));

  return (
    <ReportSection title={title}>
      {insights.length === 0 ? (
        <p className="text-[14px] font-medium text-[#8c8c8c]">아직 준비 중인 분석이에요</p>
      ) : (
        <div className="flex w-full flex-col gap-[12px]">
          {insights.map(({ category, title: insightTitle, description }, index) => (
            <SummaryCard key={`${category}-${index}`} title={insightTitle} description={description} />
          ))}
        </div>
      )}
    </ReportSection>
  );
};

export default ScenarioInsight;
