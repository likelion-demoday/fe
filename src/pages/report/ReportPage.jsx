import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAnalysisReport } from "../../api/analysis";
import { getCharacterImageStatus, getCharacterImages, requestCharacterImage } from "../../api/character";
import { getCreditPrices, getMyCredits } from "../../api/credit";
import { createShareLink } from "../../api/share";

import AppHeader from "../../components/common/AppHeader";
import { SheetButton } from "../../components/common/BottomSheet";
import PurchaseSheet from "../../components/feature/analysis/PurchaseSheet";
import CharacterShareSheet from "../../components/feature/character/CharacterShareSheet";
import ReportContent from "./ReportContent";
import { getFailureMessage } from "../../constants/analysis";
import { mockAnalysisReportResponse } from "../../mocks/analysisReportResponse";
import { buildMockReportExtras } from "../../mocks/reportExtras";
import { saveChargeReturn } from "../../utils/chargeReturn";
import { toReportView } from "../../utils/reportMapper";
import { shareText } from "../../utils/share";

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

// 화자 이름이 없으면 reportMapper가 "나"로 채우므로 공유 문구에서는 "상대방"으로 표시
const buildShareMessage = (nickname) => {
  const sharer = nickname && nickname !== "나" ? `${nickname}님이` : "상대방이";
  return `RE:SAY에서 ${sharer} 보고서를 공유하고 싶어해요. 링크에서 확인해보세요!`;
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

const ReportPage = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [loaded, setLoaded] = useState({ id: null, report: null, message: null });
  const [characterImages, setCharacterImages] = useState({ id: null, images: {}, locked: false, generating: false });
  const [imagePollKey, setImagePollKey] = useState(0);
  // 캐릭터 결제 시트: { ownedCredit, price, isFree }
  const [characterPurchase, setCharacterPurchase] = useState(null);
  const [paying, setPaying] = useState(false);
  const [shareCharacter, setShareCharacter] = useState(null);
  const [shareLink, setShareLink] = useState({ id: null, url: null });
  const [issuingLink, setIssuingLink] = useState(false);
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

  // 발급할 때마다 이전 링크가 바로 막히므로, 이 화면에서 받은 링크는 다시 발급하지 않고 재사용
  const handleShare = async () => {
    if (issuingLink) return;
    let url = shareLink.id === reportId ? shareLink.url : null;
    const isRetry = Boolean(url);
    if (!url) {
      setIssuingLink(true);
      try {
        ({ shareUrl: url } = await createShareLink(reportId));
        setShareLink({ id: reportId, url });
      } catch (e) {
        alert(e.message ?? "공유 링크를 만들지 못했어요.");
        return;
      } finally {
        setIssuingLink(false);
      }
    }

    const shared = await shareText(`${buildShareMessage(report.speakers.me.nickname)}\n${url}`);
    if (shared) return;
    // API를 기다린 첫 시도만 브라우저가 막을 수 있음. 바로 다시 눌러도 실패하면 링크를 직접 보여줌
    if (isRetry) window.prompt("아래 링크를 복사해서 보내 주세요.", url);
    else alert("공유 링크가 준비됐어요. 공유하기를 한 번 더 눌러 주세요.");
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

  return (
    <main className="mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col bg-white">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-[20px] overflow-x-hidden overflow-y-auto px-[24px] py-[16px]">
        <AppHeader />

        <ReportContent report={report} onUnlockCharacter={openCharacterPurchase} onShareCharacter={setShareCharacter} />

        {/* 화면 하단 고정이 아니라 보고서 맨 끝에 붙는 버튼 */}
        <div className="-mx-[4px] mt-auto flex shrink-0 gap-[12px] py-[14px]">
          <SheetButton text="공유하기" onClick={handleShare} disabled={issuingLink} />
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
