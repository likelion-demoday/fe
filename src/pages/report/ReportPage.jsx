import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAnalysisReport } from "../../api/analysis";
import { getCharacterImageStatus, getCharacterImages, requestCharacterImage } from "../../api/character";
import { getCreditPrices, getMyCredits } from "../../api/credit";

import AppHeader from "../../components/common/AppHeader";
import { SheetButton } from "../../components/common/BottomSheet";
import PurchaseSheet from "../../components/feature/analysis/PurchaseSheet";
import CharacterShareSheet from "../../components/feature/character/CharacterShareSheet";
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
import { getFailureMessage } from "../../constants/analysis";
import { CONFLICT_INFO_LABELS, PARENT_CONFLICT_INFO_LABELS, PERCENT_METRIC_CAPTION } from "../../constants/report";
import { mockAnalysisReportResponse } from "../../mocks/analysisReportResponse";
import { buildMockReportExtras } from "../../mocks/reportExtras";
import { saveChargeReturn } from "../../utils/chargeReturn";
import { toReportView } from "../../utils/reportMapper";
import { shareCurrentPage } from "../../utils/share";

const ANALYZING_MESSAGE = "아직 분석 중이에요. 잠시 후 다시 확인해 주세요.";

// 개발용 목데이터: /report/mock (친구·일상), /report/mock-couple (연인·일상), /report/mock-conflict (연인·갈등), /report/mock-parent (부모·자녀 갈등)
const DEV_MOCK_SCENARIOS = {
  mock: "FRIEND_DAILY",
  "mock-couple": "COUPLE_DAILY",
  "mock-conflict": "COUPLE_CONFLICT",
  "mock-parent": "PARENT_CHILD_CONFLICT",
};

const fetchReport = (reportId) => {
  const scenario = import.meta.env.DEV && DEV_MOCK_SCENARIOS[reportId];
  if (!scenario) return getAnalysisReport(reportId);

  const { report } = mockAnalysisReportResponse;
  return Promise.resolve({
    ...mockAnalysisReportResponse,
    report: {
      ...report,
      recordingInfo: { ...report.recordingInfo, scenario },
      qualitativeAnalysis: { ...report.qualitativeAnalysis, ...buildMockReportExtras(scenario) },
    },
  });
};

const IMAGE_POLLING_MS = 3000;
const IMAGE_POLLING_LIMIT = 60; // 최대 3분

const withCharacterImages = (report, images, locked, generating) => {
  const attach = (speaker) => ({
    ...speaker,
    character: { ...speaker.character, ...images[speaker.role], locked, generating },
  });
  return { ...report, speakers: { me: attach(report.speakers.me), partner: attach(report.speakers.partner) } };
};

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

const ReportPage = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [section, setSection] = useState("overview");
  const [loaded, setLoaded] = useState({ id: null, report: null, message: null });
  const [characterImages, setCharacterImages] = useState({ id: null, images: {}, locked: false, generating: false });
  const [imagePollKey, setImagePollKey] = useState(0);
  // 캐릭터 결제 시트: { ownedCredit, price, isFree }
  const [characterPurchase, setCharacterPurchase] = useState(null);
  const [paying, setPaying] = useState(false);
  const [shareCharacter, setShareCharacter] = useState(null);
  const isCurrent = loaded.id === reportId;
  const isImagesCurrent = characterImages.id === reportId;
  const images = isImagesCurrent ? characterImages.images : {};
  const report = isCurrent && loaded.report
    ? withCharacterImages(
        loaded.report,
        images,
        isImagesCurrent && characterImages.locked,
        isImagesCurrent && characterImages.generating,
      )
    : null;
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
          finish({
            message: result.status === "ANALYZING" ? ANALYZING_MESSAGE : getFailureMessage(result.failureReason),
          });
        }
      })
      .catch((e) => finish({ message: e.message ?? "보고서를 불러오지 못했어요." }));

    return () => {
      cancelled = true;
    };
  }, [reportId]);

  // 캐릭터 이미지는 비동기 생성 → 생성 중이면 끝날 때까지 폴링 (없어도 보고서는 보여줌)
  // 생성 요청 전이면 images가 빈 배열로 오므로 잠금 카드로 표시
  useEffect(() => {
    if (import.meta.env.DEV && DEV_MOCK_SCENARIOS[reportId]) return;
    let timer;
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const { images = [] } = await getCharacterImageStatus(reportId);
        const isPending = images.some(({ status }) => status === "PENDING" || status === "GENERATING");
        if (!isPending) {
          const characters = await getCharacterImages(reportId);
          if (!cancelled) {
            setCharacterImages({ id: reportId, images: characters, locked: images.length === 0, generating: false });
          }
          return;
        }
        // 생성 중이면 "생성중..." 카드로 표시하고 계속 확인
        if (!cancelled) setCharacterImages({ id: reportId, images: {}, locked: false, generating: true });
      } catch {
        // 일시적인 오류는 다음 주기에 다시 시도
      }
      attempts += 1;
      if (!cancelled && attempts < IMAGE_POLLING_LIMIT) timer = setTimeout(poll, IMAGE_POLLING_MS);
    };

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reportId, imagePollKey]);

  const goToCharge = () => {
    saveChargeReturn(`/report/${reportId}`);
    navigate("/mypage/payments");
  };

  const openCharacterPurchase = async () => {
    try {
      const [credits, prices] = await Promise.all([getMyCredits(), getCreditPrices()]);
      const isFree = credits.characterFreeAvailable;
      setCharacterPurchase({
        ownedCredit: credits.balance ?? 0,
        price: isFree ? 0 : prices.character ?? 0,
        isFree,
      });
    } catch (e) {
      alert(e.message ?? "크레딧 정보를 불러오지 못했어요.");
    }
  };

  // 생성 요청이 곧 결제 (나·상대방 캐릭터 한 세트). 실패하면 서버가 크레딧을 환급
  const handleCharacterPurchase = async () => {
    if (paying) return;
    setPaying(true);
    try {
      await requestCharacterImage(reportId);
      setCharacterPurchase(null);
      setCharacterImages((prev) => ({ ...prev, locked: false, generating: true }));
      setImagePollKey((key) => key + 1);
    } catch (e) {
      if (e.code === "CREDIT402_1") goToCharge();
      else alert(e.message ?? "요청에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setPaying(false);
    }
  };

  if (!report) {
    return (
      <main className="mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col bg-white px-[24px] py-[16px]">
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-[20px]">
          <p className="text-title-medium text-center whitespace-pre-line text-[#595959]">{message ?? "보고서를 불러오는 중이에요"}</p>
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
    <main className="mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col bg-white">
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

          <SectionContent report={report} onUnlockCharacter={openCharacterPurchase} onShareCharacter={setShareCharacter} />
        </div>

        {/* 화면 하단 고정이 아니라 보고서 맨 끝에 붙는 버튼 */}
        <div className="-mx-[4px] mt-auto flex shrink-0 gap-[12px] py-[14px]">
          <SheetButton text="공유하기" onClick={() => shareCurrentPage("RE:SAY 대화 분석 보고서")} />
          <SheetButton text="완료" onClick={() => navigate("/home")} />
        </div>
      </div>

      {shareCharacter && <CharacterShareSheet character={shareCharacter} onClose={() => setShareCharacter(null)} />}

      {characterPurchase && (
        <PurchaseSheet
          productName="캐릭터 카드 보기"
          ownedCredit={characterPurchase.ownedCredit}
          price={characterPurchase.price}
          purchaseText={characterPurchase.isFree ? "무료로 열기" : undefined}
          onClose={() => setCharacterPurchase(null)}
          onPurchase={handleCharacterPurchase}
          onCharge={goToCharge}
        />
      )}
    </main>
  );
};

export default ReportPage;
