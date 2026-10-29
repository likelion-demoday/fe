import { useId, useState } from "react";

import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import dotImage from "../../../assets/icons/habit-history-dot.svg";


const AREA_WIDTH = 290;
const AREA_HEIGHT = 154;
const LINE_LEFT = 26;
const LINE_WIDTH = 237;
// 말하는 비중 100% → PLOT_TOP, 0% → PLOT_BOTTOM
const PLOT_TOP = 28;
const PLOT_BOTTOM = 152.5;
const DOT_SIZE = 8;

const DRAW_DURATION_MS = 900;
const DRAW_EASING = "cubic-bezier(0.33, 1, 0.68, 1)";
const DOT_POP_MS = 300;
const DOT_POP_EASING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// 오래된 분석이 왼쪽
const toPoints = (history) => {
  const sorted = [...history].sort((a, b) => new Date(a.analyzedAt) - new Date(b.analyzedAt));
  const stepX = sorted.length > 1 ? LINE_WIDTH / (sorted.length - 1) : 0;
  return sorted.map(({ recordingId, speakingRatioPercent }, index) => ({
    id: recordingId,
    x: sorted.length > 1 ? LINE_LEFT + stepX * index : LINE_LEFT + LINE_WIDTH / 2,
    y: PLOT_BOTTOM - (Math.min(100, Math.max(0, speakingRatioPercent)) / 100) * (PLOT_BOTTOM - PLOT_TOP),
  }));
};

const revealStyle = (revealed) => ({
  clipPath: revealed ? "inset(-2px -2px -2px -2px)" : "inset(-2px 100% -2px -2px)",
  transition: `clip-path ${DRAW_DURATION_MS}ms ${DRAW_EASING}, opacity ${DRAW_DURATION_MS}ms ease-out`,
});


// 선이 왼쪽부터 그려지므로 점은 선이 지나갈 때쯤 등장
const dotDelay = (x) => {
  const progress = Math.min(1, Math.max(0, x / AREA_WIDTH));
  const time = 1 - Math.cbrt(1 - progress);
  return Math.max(0, time * DRAW_DURATION_MS - DOT_POP_MS / 2);
};


const HabitHistoryCard = ({ count, history = [], active = true, onDetail }) => {
  const [revealed, setRevealed] = useState(active);
  if (active && !revealed) setRevealed(true);
  const gradientId = useId();

  const points = toPoints(history);
  const linePoints = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPath =
    points.length > 1
      ? `M${points[0].x},${PLOT_BOTTOM} L${linePoints} L${points.at(-1).x},${PLOT_BOTTOM} Z`
      : null;

  return (
    <section className="flex h-full w-full flex-col items-center gap-[16px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[44px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
      <div className="flex w-full flex-col">
        <p className="text-caption text-[#bfbfbf]">최근 {count}회 분석 기준</p>
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
        <svg
          className="absolute inset-0 overflow-visible motion-reduce:transition-none"
          width={AREA_WIDTH}
          height={AREA_HEIGHT}
          viewBox={`0 0 ${AREA_WIDTH} ${AREA_HEIGHT}`}
          aria-hidden="true"
          style={{ ...revealStyle(revealed), opacity: revealed ? 1 : 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#FFE2D8" />
              <stop offset="1" stopColor="#FFE2D8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
          {points.length > 1 && <polyline points={linePoints} fill="none" stroke="#FF8D77" />}
        </svg>

        {/* 축 */}
        <span className="absolute top-0 left-0 h-[154px] w-[1.5px] rounded-[97px] bg-gradient-to-t from-[#c3c3c3] to-[#d9d9d9]" />
        <span className="absolute top-[152.5px] left-0 h-[1.5px] w-[290px] rounded-[97px] bg-gradient-to-r from-[#c3c3c3] to-[#d9d9d9]" />
        <p className="text-label-small absolute top-0 left-[8px] whitespace-nowrap text-[#8c8c8c]">
          말하는 비중
        </p>
        <p className="text-label-small absolute top-[132px] left-[269px] whitespace-nowrap text-[#8c8c8c]">
          시간
        </p>

        {points.map(({ id, x, y }) => (
          <img
            key={id}
            src={dotImage}
            alt=""
            className="absolute block size-[8px] max-w-none motion-reduce:transition-none"
            style={{
              left: x - DOT_SIZE / 2,
              top: y - DOT_SIZE / 2,
              transform: revealed ? "scale(1)" : "scale(0)",
              transition: `transform ${DOT_POP_MS}ms ${DOT_POP_EASING} ${dotDelay(x)}ms`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HabitHistoryCard;
