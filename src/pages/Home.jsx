import { useNavigate } from "react-router-dom";

import AppHeader from "../components/common/AppHeader";
import HabitSummaryCarousel from "../components/feature/home/HabitSummaryCarousel";
import CharacterCarousel from "../components/feature/home/CharacterCarousel";
import { SheetButton } from "../components/feature/analysis/RecordEndSheet";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[20px] overflow-x-hidden overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
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
        <SheetButton
          text="분석 시작하기"
          onClick={() => navigate("/analysis")}
        />
      </div>
    </main>
  );
};

export default Home;
