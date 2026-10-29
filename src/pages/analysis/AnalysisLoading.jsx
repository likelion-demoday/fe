import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getAnalysisReport } from "../../api/analysis";
import { getRecordingStatus } from "../../api/recording";
import { requestCharacterImage } from "../../api/character";
import { getFailureMessage } from "../../constants/analysis";
import { clearPendingAnalysis, savePendingAnalysis } from "../../utils/pendingAnalysis";

import AppHeader from "../../components/common/AppHeader";
import BottomSheet, { SheetButton } from "../../components/common/BottomSheet";
import LoadingMotion from "../../components/feature/analysis/LoadingMotion";
import analysisFailedImage from "../../assets/images/analysis-failed.png";

const FAILED_IMAGE = { src: analysisFailedImage, className: "inset-0 size-full object-cover" };

const POLLING_MS = 3000;

// phase: "transcribing"(전사 대기 → 화자 선택) | "analyzing"(분석 대기 → 분석완료)
const AnalysisLoading = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isDone, setIsDone] = useState(false);
  // 분석 실패 시 안내 문구 (null이면 실패 아님)
  const [failureMessage, setFailureMessage] = useState(null);
  const isAnalyzing = state?.phase === "analyzing";

  useEffect(() => {
    const recordingId = state?.recordingId;
    if (!recordingId) return;
    savePendingAnalysis(state);

    let timer;
    let cancelled = false;

    const poll = async () => {
      try {
        const { step, failureReason } = await getRecordingStatus(recordingId);
        if (cancelled) return;

        if (!isAnalyzing && step === "SPEAKER_SELECTION_REQUIRED") {
          navigate("/analysis/speaker", { replace: true, state });
          return;
        }
        if (isAnalyzing && step === "COMPLETED") {
          // 캐릭터 이미지는 비동기 생성. 중복 요청은 서버에서 alreadyRequested로 처리
          requestCharacterImage(recordingId).catch((error) => console.error(error.message));
          clearPendingAnalysis();
          setIsDone(true);
          return;
        }
        if (step === "FAILED") {
          // 상태 API는 분석 단계 실패를 ANALYSIS_FAILED로만 주므로 상세 사유는 보고서 API에서 조회
          const reason =
            failureReason === "ANALYSIS_FAILED"
              ? await getAnalysisReport(recordingId)
                  .then((report) => report.failureReason ?? failureReason)
                  .catch(() => failureReason)
              : failureReason;
          if (cancelled) return;
          clearPendingAnalysis();
          setFailureMessage(getFailureMessage(reason));
          return;
        }
      } catch {
        // 일시적인 오류는 다음 주기에 다시 시도
      }
      if (!cancelled) timer = setTimeout(poll, POLLING_MS);
    };

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.recordingId, isAnalyzing, navigate]);

  const goToHome = () => navigate("/home", { replace: true });
  const goToReport = () => navigate(`/report/${state.recordingId}`, { replace: true });

  return (
    <main className="relative mx-auto h-[844px] w-[390px] overflow-hidden bg-white">
      <div className="px-[24px] py-[16px]">
        <AppHeader />
      </div>
 
      <LoadingMotion className="absolute top-[330px] left-1/2 h-[75px] w-[66px] -translate-x-1/2" />

      <div className="absolute top-[441px] left-1/2 flex w-[195px] -translate-x-1/2 flex-col items-center gap-[16px] text-center">
        <h1 className="text-display w-full text-black" role="status">
          {/* "..."은 가운데 정렬 계산에서 빼서 "분석중" 글자가 로딩 모션과 같은 중심에 오게 함 */}
          <span className="relative">
            분석중
            <span aria-hidden="true" className="absolute left-full">
              {[0, 1, 2].map((index) => (
                <span key={index} style={{ animation: `analysis-dot 1.4s ${index * 0.2}s infinite` }}>
                  .
                </span>
              ))}
            </span>
          </span>
        </h1>
        <div className="flex w-full flex-col items-center gap-[8px]">
          <p className="text-title-medium w-full text-black">5분정도 시간이 소요돼요</p>
          <p className="text-caption w-full text-[#595959]">화면을 나가도 분석은 계속돼요</p>
        </div>
      </div>

      {failureMessage && (
        <BottomSheet
          title="대화 분석 실패"
          image={FAILED_IMAGE}
          onClose={goToHome}
          footer={
            <>
              <SheetButton text="다른 녹음 분석" onClick={() => navigate("/analysis", { replace: true })} />
              <SheetButton text="분석하지 않기" onClick={goToHome} />
            </>
          }
        >
          <div className="flex w-full flex-col items-center gap-[21px] text-center">
            <h3 className="text-heading whitespace-nowrap text-black">대화를 분석하기 어려워요</h3>
            <p className="text-label whitespace-pre-line text-[#595959]">{failureMessage}</p>
          </div>
        </BottomSheet>
      )}

      {isDone && (
        <BottomSheet
          title="분석완료!"
          onClose={goToHome}
          footer={<SheetButton text="다음" onClick={goToReport} />}
        />
      )}
    </main>
  );
};

export default AnalysisLoading;
