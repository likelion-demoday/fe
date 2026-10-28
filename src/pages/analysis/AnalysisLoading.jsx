import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getRecordingStatus } from "../../api/recording";
import { requestCharacterImage } from "../../api/character";
import { getFailureMessage } from "../../constants/analysis";

import AppHeader from "../../components/common/AppHeader";
import BottomSheet, { SheetButton } from "../../components/common/BottomSheet";
import characterImage from "../../assets/images/record-end-character.png";

const POLLING_MS = 3000;

// phase: "transcribing"(전사 대기 → 화자 선택) | "analyzing"(분석 대기 → 분석완료)
const AnalysisLoading = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isDone, setIsDone] = useState(false);
  const isAnalyzing = state?.phase === "analyzing";

  useEffect(() => {
    const recordingId = state?.recordingId;
    if (!recordingId) return;

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
          setIsDone(true);
          return;
        }
        if (step === "FAILED") {
          alert(getFailureMessage(failureReason));
          navigate("/home", { replace: true });
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
 
      <div className="absolute top-[262px] left-1/2 flex -translate-x-1/2 flex-col items-center" aria-hidden="true">
        <div
          className="relative size-[136px] overflow-hidden"
          style={{ animation: "analysis-float 1.8s ease-in-out infinite" }}
        >
          <img
            src={characterImage}
            alt=""
            className="pointer-events-none absolute top-[-4.41%] left-[-4.41%] size-[108.82%] max-w-none"
          />
        </div>
        <span
          className="mt-[4px] h-[10px] w-[72px] rounded-[50%] bg-[rgba(0,0,0,0.3)] blur-[3px]"
          style={{ animation: "analysis-shadow 1.8s ease-in-out infinite" }}
        />
      </div>

      <div className="absolute top-[441px] left-1/2 flex w-[195px] -translate-x-1/2 flex-col items-center gap-[16px] text-center">
        <h1 className="text-display w-full text-black" role="status">
          분석중
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              aria-hidden="true"
              style={{ animation: `analysis-dot 1.4s ${index * 0.2}s infinite` }}
            >
              .
            </span>
          ))}
        </h1>
        <div className="flex w-full flex-col items-center gap-[8px]">
          <p className="text-title-medium w-full text-black">5분정도 시간이 소요돼요</p>
          <p className="text-caption w-full text-[#595959]">화면을 나가도 분석은 계속돼요</p>
        </div>
      </div>

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
