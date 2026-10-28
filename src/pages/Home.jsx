import { useNavigate } from "react-router-dom";

import AppHeader from "../components/common/AppHeader";
import HabitSummaryCarousel from "../components/feature/home/HabitSummaryCarousel";
import CharacterCarousel from "../components/feature/home/CharacterCarousel";
import { SheetButton } from "../components/feature/analysis/RecordEndSheet";

const Home = () => {
  const navigate = useNavigate();

  return (
    // 휴대폰처럼 화면이 844px보다 짧으면 화면 높이에 맞춰 줄여서 하단 버튼이 항상 보이게 함
    <div className="relative mx-auto h-[min(844px,100dvh)] w-[390px] bg-white">
      {/* 하단 고정 버튼에 마지막 내용이 가리지 않도록 아래 여백 확보 */}
      <main className="flex h-full w-full flex-col gap-[20px] overflow-x-hidden overflow-y-auto no-scrollbar px-[24px] pt-[16px] pb-[120px]">
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
    </div>
  );
};

export default Home;
