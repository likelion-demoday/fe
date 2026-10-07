import { useState } from "react";

import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import areaImage from "../../../assets/icons/habit-history-area.svg";
import lineImage from "../../../assets/icons/habit-history-line.svg";
import dotImage from "../../../assets/icons/habit-history-dot.svg";


const POINTS = [
  { left: 22, top: 88 },
  { left: 101, top: 46 },
  { left: 180, top: 59 },
  { left: 259, top: 29 },
];

// 처음 보일 때 선이 왼쪽→오른쪽으로 그려지고, 선이 지나가는 순간 점이 튀어나옴
const DRAW_DURATION_MS = 900;
const DRAW_EASING = "cubic-bezier(0.33, 1, 0.68, 1)";
const DOT_POP_MS = 300;
const DOT_POP_EASING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const LINE_LEFT = 26;
const LINE_WIDTH = 237;

const revealStyle = (revealed) => ({
  clipPath: revealed ? "inset(-2px -2px -2px -2px)" : "inset(-2px 100% -2px -2px)",
  transition: `clip-path ${DRAW_DURATION_MS}ms ${DRAW_EASING}, opacity ${DRAW_DURATION_MS}ms ease-out`,
});


const dotDelay = (left) => {
  const progress = Math.min(1, Math.max(0, (left + 4 - LINE_LEFT) / LINE_WIDTH));
  const time = 1 - Math.cbrt(1 - progress);
  return Math.max(0, time * DRAW_DURATION_MS - DOT_POP_MS / 2);
};


const HabitHistoryCard = ({ active = true, onDetail }) => {
  const [revealed, setRevealed] = useState(active);
  if (active && !revealed) setRevealed(true);

  return (
    <section className="flex h-full w-full flex-col items-center gap-[16px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[44px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
      <div className="flex w-full flex-col">
        <p className="text-caption text-[#bfbfbf]">최근 n회 분석 기준</p>
        <div className="flex w-full items-center justify-between">
          <h3 className="text-title-semibold flex-1 text-black">습관 히스토리</h3>
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
        <img
          src={areaImage}
          alt=""
          className="absolute top-[32.5px] left-[26.5px] block h-[120.5px] w-[237px] max-w-none motion-reduce:transition-none"
          style={{ ...revealStyle(revealed), opacity: revealed ? 1 : 0 }}
        />

        {/* 축 */}
        <span className="absolute top-0 left-0 h-[154px] w-[1.5px] rounded-[97px] bg-gradient-to-t from-[#c3c3c3] to-[#d9d9d9]" />
        <span className="absolute top-[152.5px] left-0 h-[1.5px] w-[290px] rounded-[97px] bg-gradient-to-r from-[#c3c3c3] to-[#d9d9d9]" />
        <p className="text-label-small absolute top-0 left-[8px] whitespace-nowrap text-[#8c8c8c]">
          말하는 비중
        </p>
        <p className="text-label-small absolute top-[132px] left-[269px] whitespace-nowrap text-[#8c8c8c]">
          시간
        </p>

        {POINTS.map(({ left, top }) => (
          <img
            key={left}
            src={dotImage}
            alt=""
            className="absolute block size-[8px] max-w-none motion-reduce:transition-none"
            style={{
              left,
              top,
              transform: revealed ? "scale(1)" : "scale(0)",
              transition: `transform ${DOT_POP_MS}ms ${DOT_POP_EASING} ${dotDelay(left)}ms`,
            }}
          />
        ))}
        <div
          className="absolute top-[32.5px] left-[26px] h-[60px] w-[237px] motion-reduce:transition-none"
          style={revealStyle(revealed)}
        >
          <img src={lineImage} alt="" className="absolute inset-[-0.77%_0_-0.74%_0] block size-full max-w-none" />
        </div>
      </div>
    </section>
  );
};

export default HabitHistoryCard;
