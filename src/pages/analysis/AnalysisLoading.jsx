import AppHeader from "../../components/common/AppHeader";
import characterImage from "../../assets/images/record-end-character.png";

const AnalysisLoading = () => {
  // TODO: 분석 상태 API 폴링 후 완료 시 리포트 화면으로 이동
  return (
    <main className="relative mx-auto h-[844px] w-[390px] overflow-hidden bg-white">
      <div className="px-[24px] py-[16px]">
        <AppHeader />
      </div>

      {/* 로딩 모션: 캐릭터가 둥실 떠오르고 아래 그림자가 함께 줄었다 늘어남 */}
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
    </main>
  );
};

export default AnalysisLoading;
