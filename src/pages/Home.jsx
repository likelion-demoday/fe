import AppHeader from "../components/common/AppHeader";
import FrequentWordsCard from "../components/feature/home/FrequentWordsCard";
import CharacterCarousel from "../components/feature/home/CharacterCarousel";

const Home = () => {
  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[20px] overflow-x-hidden overflow-y-auto bg-white px-[24px] py-[16px]">
      <AppHeader />

      <div className="flex w-full flex-col gap-[36px]">
        <section className="flex w-full flex-col gap-[12px]">
          <h2 className="text-heading text-black">대화 습관 요약</h2>
          <FrequentWordsCard />
        </section>

        <section className="flex w-full flex-col gap-[12px]">
          <h2 className="text-heading text-black">나의 캐릭터</h2>
          <CharacterCarousel />
        </section>
      </div>
    </main>
  );
};

export default Home;
