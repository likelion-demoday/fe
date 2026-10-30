import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRecordingStatus } from "../api/recording";
import AppHeader from "../components/common/AppHeader";
import BottomSheet from "../components/common/BottomSheet";
import HabitSummaryCarousel from "../components/feature/home/HabitSummaryCarousel";
import CharacterCarousel from "../components/feature/home/CharacterCarousel";
import { SheetButton } from "../components/feature/analysis/RecordEndSheet";
import { getPendingAnalysis } from "../utils/pendingAnalysis";

const Home = () => {
  const navigate = useNavigate();
  // 화자 선택을 기다리는 진행 중 분석 (이어하기 시트 표시용)
  const [speakerPending, setSpeakerPending] = useState(null);

  // 로딩 화면을 나간 분석 이어가기. 전사·분석 중이면 서버가 계속 진행하므로 그대로 둠
  useEffect(() => {
    const pending = getPendingAnalysis();
    if (!pending?.recordingId) return;

    let cancelled = false;
    getRecordingStatus(pending.recordingId)
      .then(({ step }) => {
        if (cancelled) return;
        if (step === "SPEAKER_SELECTION_REQUIRED") {
          setSpeakerPending(pending);
        } else if (step === "COMPLETED" || step === "FAILED") {
          // 로딩 화면에서 완료/실패 시트를 보여주고 저장된 정보를 지움
          navigate("/analysis/loading", {
            state: { ...pending, phase: step === "COMPLETED" ? "analyzing" : "transcribing" },
          });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    // 휴대폰처럼 화면이 844px보다 짧으면 화면 높이에 맞춰 줄여서 하단 버튼이 항상 보이게 함
    <div className="relative mx-auto h-[min(844px,100dvh)] w-[390px] bg-white">
      {/* 하단 고정 버튼에 마지막 내용이 가리지 않도록 아래 여백 확보 */}
      {/* isolate: 캐릭터 카드의 z-index가 이 영역 안에서만 작동해서 하단 고정 버튼 아래로 지나가게 함 */}
      <main className="isolate flex h-full w-full flex-col gap-[20px] overflow-x-hidden overflow-y-auto no-scrollbar px-[24px] pt-[16px] pb-[120px]">
        <AppHeader />

        <div className="flex w-full flex-col gap-[36px]">
          <section className="flex w-full flex-col gap-[12px]">
            <h2 className="text-heading text-black">대화 습관 요약</h2>
            <HabitSummaryCarousel />
          </section>

          <section className="flex w-full flex-col gap-[12px]">
            <h2 className="text-heading text-black">나의 캐릭터</h2>
            <CharacterCarousel />
          </section>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 z-10 flex w-full bg-gradient-to-b from-[rgba(255,255,255,0)] to-white to-[15.614%] px-[24px] pt-[20px] pb-[30px]">
        <SheetButton
          text="분석 시작하기"
          onClick={() => navigate("/analysis")}
        />
      </div>

      {speakerPending && (
        <BottomSheet
          title="분석이 멈춰 있어요"
          onClose={() => setSpeakerPending(null)}
          footer={
            <>
              <SheetButton text="나중에" onClick={() => setSpeakerPending(null)} />
              <SheetButton
                text="이어하기"
                onClick={() => navigate("/analysis/speaker", { state: speakerPending })}
              />
            </>
          }
        >
          <p className="text-label text-center text-[#595959]">화자를 선택하면 분석이 이어져요</p>
        </BottomSheet>
      )}
    </div>
  );
};

export default Home;
