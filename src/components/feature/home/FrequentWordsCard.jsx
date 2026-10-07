import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import bubbleLine from "../../../assets/icons/home-bubble-line.svg";

const BUBBLES = [
  {
    word: "맛있다",
    count: 12,
    className: "top-[5px] left-[143px] size-[149px]",
    background: "linear-gradient(154.74deg, #ff765b 13.04%, #ff8d77 84.85%)",
  },
  {
    word: "엥?",
    className: "top-[49px] left-[38px] size-[105px] text-[18px] font-semibold tracking-[0.72px] text-[#fff1ef]",
    background: "linear-gradient(205.65deg, #ff8d77 14.97%, #ffb0a0 85.04%)",
  },
  {
    word: "아니",
    className: "top-[13px] left-[106px] size-[47px] bg-[#ffe2d8] text-label-small text-white",
  },
  {
    word: "존*",
    className: "top-[7px] left-0 size-[65px] text-label text-[#fff1ef]",
    background: "linear-gradient(191.13deg, #ffb0a0 8.22%, #fad5c9 89.67%)",
  },
];

const FrequentWordsCard = ({ onDetail }) => {
  return (
    <section className="flex w-full flex-col items-center h-full gap-[20px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[48px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
      <div className="flex w-full flex-col gap-[4px]">
        <p className="text-caption text-[#bfbfbf]">최근 n회 분석 기준</p>
        <div className="flex w-full items-center justify-between">
          <h3 className="text-title-semibold flex-1 text-black">자주 사용하는 말</h3>
          <button
            type="button"
            onClick={onDetail}
            className="flex items-center justify-center gap-[2px] rounded-[6px] px-[6px]"
          >
            <span className="text-caption whitespace-nowrap text-[#8c8c8c]">자세히 보기</span>
            <img src={chevronRightIcon} alt="" className="block h-[11px] w-[7px] max-w-none shrink-0" />
          </button>
        </div>
      </div>

      <div className="relative h-[154px] w-[290px] shrink-0">
        <div className="absolute top-[11.44px] left-[127px] flex h-[114.613px] w-[52px] items-center justify-center">
          <div className="relative h-[0.138px] w-[125.755px] -rotate-[65.64deg]">
            <img src={bubbleLine} alt="" className="absolute inset-[-909.08%_0] block max-w-none" />
          </div>
        </div>
        {BUBBLES.map(({ word, count, className, background }) => (
          <div
            key={word}
            className={`absolute flex flex-col items-center justify-center rounded-full border border-white text-center ${className}`}
            style={background ? { backgroundImage: background } : undefined}
          >
            {count ? (
              <>
                <span className="text-heading text-white">{word}</span>
                <span className="text-label text-white">{count}번</span>
              </>
            ) : (
              word
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FrequentWordsCard;
