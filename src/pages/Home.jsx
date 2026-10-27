import { useNavigate } from "react-router-dom";

import AppHeader from "../components/common/AppHeader";
import HabitSummaryCarousel from "../components/feature/home/HabitSummaryCarousel";
import CharacterCarousel from "../components/feature/home/CharacterCarousel";
import { SheetButton } from "../components/feature/analysis/RecordEndSheet";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto h-[844px] w-[390px] bg-white">
      <main className="flex h-full w-full flex-col gap-[20px] overflow-x-hidden overflow-y-auto no-scrollbar px-[24px] py-[16px]">
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

      <div className="absolute bottom-0 left-0 flex w-full bg-gradient-to-b from-[rgba(255,255,255,0)] to-white to-[15.614%] px-[24px] pt-[20px] pb-[30px]">
        <SheetButton
          text="분석 시작하기"
          onClick={() => navigate("/analysis")}
        />
      </div>
    </div>
  );
};

export default Home;
