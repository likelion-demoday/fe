import { useState } from "react";

import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import bubbleLine from "../../../assets/icons/home-bubble-line.svg";
import useBubblePhysics from "../../../hooks/useBubblePhysics";


const AREA_WIDTH = 290;
const AREA_HEIGHT = 154;
const BOUNCE_CEILING = -20;

// 말풍선 위치·크기·색은 디자인 고정, 단어는 많이 쓴 순서대로 채움 (횟수는 첫 번째만 표시)
const BUBBLE_SLOTS = [
  {
    showCount: true,
    x: 143,
    y: 5,
    size: 127,
    background: "linear-gradient(154.74deg, #ff765b 13.04%, #ff8d77 84.85%)",
  },
  {
    x: 38,
    y: 49,
    size: 90,
    className: "text-[18px] font-semibold tracking-[0.72px] text-[#fff1ef]",
    background: "linear-gradient(205.65deg, #ff8d77 14.97%, #ffb0a0 85.04%)",
  },
  {
    x: 106,
    y: 13,
    size: 40,
    className: "bg-[#ffe2d8] text-label-small text-white",
  },
  {
    x: 0,
    y: 7,
    size: 55,
    className: "text-label text-[#fff1ef]",
    background: "linear-gradient(191.13deg, #ffb0a0 8.22%, #fad5c9 89.67%)",
  },
];

const toBubbles = (expressions) =>
  [...expressions]
    .sort((a, b) => b.count - a.count)
    .slice(0, BUBBLE_SLOTS.length)
    .map(({ expression, count }, index) => ({
      ...BUBBLE_SLOTS[index],
      word: expression,
      count: BUBBLE_SLOTS[index].showCount ? count : null,
    }));

// 물리 시뮬레이션은 처음 마운트 때 말풍선 배치를 고정하므로, 데이터가 다 온 뒤에 렌더해야 함
const FrequentWordsCard = ({ count, expressions = [], onDetail }) => {
  const [bubbles] = useState(() => toBubbles(expressions));
  const { setElement, kick } = useBubblePhysics(
    bubbles,
    AREA_WIDTH,
    AREA_HEIGHT,
    BOUNCE_CEILING,
  );

  return (
    <section className="flex w-full flex-col items-center h-full gap-[20px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[48px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
      <div className="flex w-full flex-col gap-[4px]">
        <p className="text-caption text-[#bfbfbf]">최근 {count}회 분석 기준</p>
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
        {bubbles.length === 0 && (
          <p className="text-caption absolute inset-0 flex items-center justify-center text-[#595959]">
            아직 자주 쓰는 말이 없어요
          </p>
        )}
        {bubbles.map(({ word, count: wordCount, x, y, size, className = "", background }, index) => (
          <div
            key={index}
            ref={setElement(index)}
            onPointerEnter={(e) => e.pointerType === "mouse" && kick(index)}
            onPointerDown={() => kick(index)}
            className={`absolute top-0 left-0 flex cursor-pointer flex-col items-center justify-center rounded-full border border-white text-center select-none will-change-transform ${className}`}
            style={{
              width: size,
              height: size,
              transform: `translate(${x}px, ${y}px)`,
              backgroundImage: background,
            }}
          >
            {wordCount ? (
              <>
                <span className="text-heading text-white">{word}</span>
                <span className="text-label text-white">{wordCount}번</span>
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
