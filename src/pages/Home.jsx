import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRecordingStatus } from "../api/recording";
import AppHeader from "../components/common/AppHeader";
import BottomSheet from "../components/common/BottomSheet";
import HabitSummaryCarousel from "../components/feature/home/HabitSummaryCarousel";
import CharacterCarousel from "../components/feature/home/CharacterCarousel";
import { SheetButton } from "../components/feature/analysis/RecordEndSheet";
import { daysUntilDeleted, getPendingAnalyses, removePendingAnalysis } from "../utils/pendingAnalysis";

const Home = () => {
  const navigate = useNavigate();
  // 이어하기 시트: { kind: "speaker" | "unpaid", item } (한 번에 하나만)
  const [resumeSheet, setResumeSheet] = useState(null);
  // 결제 후 전사·분석이 진행 중인 녹음 (홈 상단 안내)
  const [inProgress, setInProgress] = useState(null);

  // 화면을 나간 분석 이어가기. 저장된 녹음마다 서버 상태를 확인해서 다음 단계를 안내
  useEffect(() => {
    const pendings = getPendingAnalyses();
    if (pendings.length === 0) return;

    let cancelled = false;
    Promise.all(
      pendings.map((item) =>
        getRecordingStatus(item.recordingId)
          .then(({ step }) => ({ item, step }))
          .catch((error) => {
            // 서버에 없는 녹음(보관 기간 만료·삭제)은 목록에서 지움. 그 밖의 오류는 다음에 다시 확인
            if (/404/.test(error?.code ?? "")) removePendingAnalysis(item.recordingId);
            return null;
          }),
      ),
    ).then((results) => {
      if (cancelled) return;
      const list = results.filter(Boolean);

      // 완료·실패: 로딩 화면에서 결과 시트를 보여주고 저장된 정보를 지움
      const finished = list.find(({ item, step }) => item.paid && (step === "COMPLETED" || step === "FAILED"));
      if (finished) {
        navigate("/analysis/loading", {
          state: { ...finished.item, phase: finished.step === "COMPLETED" ? "analyzing" : "transcribing" },
        });
        return;
      }

      const speaker = list.find(({ step }) => step === "SPEAKER_SELECTION_REQUIRED");
      const unpaid = list.find(({ item }) => !item.paid);
      if (speaker) setResumeSheet({ kind: "speaker", item: speaker.item });
      else if (unpaid) setResumeSheet({ kind: "unpaid", item: unpaid.item });

      // 결제했고 아직 화자 선택·완료·실패가 아니면 서버에서 진행 중
      const running = list.find(
        ({ item, step }) => item.paid && !["SPEAKER_SELECTION_REQUIRED", "COMPLETED", "FAILED"].includes(step),
      );
      setInProgress(running?.item ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const closeResumeSheet = () => setResumeSheet(null);
  const resumeUnpaid = ({ partner, elapsed, recordingId }) =>
    navigate("/analysis/type", { state: { partner, elapsed, recordingId } });

  return (
    // 휴대폰처럼 화면이 844px보다 짧으면 화면 높이에 맞춰 줄여서 하단 버튼이 항상 보이게 함
    <div className="relative mx-auto h-[min(844px,100dvh)] w-[390px] bg-white">
      {/* 하단 고정 버튼에 마지막 내용이 가리지 않도록 아래 여백 확보 */}
      {/* isolate: 캐릭터 카드의 z-index가 이 영역 안에서만 작동해서 하단 고정 버튼 아래로 지나가게 함 */}
      <main className="isolate flex h-full w-full flex-col gap-[20px] overflow-x-hidden overflow-y-auto no-scrollbar px-[24px] pt-[16px] pb-[120px]">
        <AppHeader />

        {inProgress && (
          <button
            type="button"
            onClick={() =>
              navigate("/analysis/loading", { state: { ...inProgress, phase: inProgress.phase ?? "transcribing" } })
            }
            className="flex w-full items-center justify-between rounded-[16px] border border-[#eee] bg-white px-[20px] py-[16px] text-left shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_49.1px_0px_rgba(0,0,0,0.1)]"
          >
            <span className="flex flex-col gap-[2px]">
              <span className="text-title-semibold text-black">대화를 분석하고 있어요</span>
              <span className="text-caption text-[#595959]">분석에는 최대 5분 걸려요</span>
            </span>
            <span className="text-caption shrink-0 text-[#ff765b]">확인하기</span>
          </button>
        )}

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

      {resumeSheet?.kind === "speaker" && (
        <BottomSheet
          title="분석이 멈춰 있어요"
          onClose={closeResumeSheet}
          footer={
            <>
              <SheetButton text="나중에" onClick={closeResumeSheet} />
              <SheetButton
                text="이어하기"
                onClick={() => navigate("/analysis/speaker", { state: resumeSheet.item })}
              />
            </>
          }
        >
          <p className="text-label text-center text-[#595959]">화자를 선택하면 분석이 이어져요</p>
        </BottomSheet>
      )}

      {resumeSheet?.kind === "unpaid" && (
        <BottomSheet
          title="분석을 기다리는 녹음이 있어요"
          onClose={closeResumeSheet}
          footer={
            <>
              <SheetButton text="나중에" onClick={closeResumeSheet} />
              <SheetButton text="이어하기" onClick={() => resumeUnpaid(resumeSheet.item)} />
            </>
          }
        >
          <p className="text-label text-center whitespace-pre-line text-[#595959]">
            {`분석 유형을 고르고 결제하면 분석이 시작돼요\n결제하지 않으면 ${daysUntilDeleted(resumeSheet.item)}일 뒤 녹음이 삭제돼요`}
          </p>
        </BottomSheet>
      )}
    </div>
  );
};

export default Home;
