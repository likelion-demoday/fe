import { useEffect, useState } from "react";

import chevronRightIcon from "../../../assets/icons/chevron-right.svg";

const GAUGE_PATH =
  "M126 0C142.546 0 158.931 3.25884 174.218 9.59082C189.505 15.9229 203.396 25.2041 215.096 36.9043C226.796 48.6045 236.077 62.4952 242.409 77.7822C248.741 93.0691 252 109.454 252 126H205.168C205.168 81.0451 170.223 44.6017 127.115 44.6016C84.0077 44.6016 49.0615 81.045 49.0615 126H0C0 109.454 3.25884 93.0691 9.59082 77.7822C15.9229 62.4952 25.2041 48.6045 36.9043 36.9043C48.6045 25.2041 62.4952 15.9229 77.7822 9.59082C93.0691 3.25884 109.454 7.23266e-07 126 0Z";
const GAUGE_RADIUS = 126;
const NEEDLE_LENGTH = 125.755;

const DEGREES_PER_PERCENT = 2;
const ANIMATION_DURATION_MS = 1000;

const toGaugeAngle = (diffPercent) =>
  Math.min(180, Math.max(0, 90 + diffPercent * DEGREES_PER_PERCENT));

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// active가 처음 true가 될 때 0 → 1로 진행 (모션 줄이기 설정 시 바로 1)
const useRevealProgress = (active, durationMs) => {
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0));
  const [hasStarted, setHasStarted] = useState(false);

  if (active && !hasStarted) setHasStarted(true);

  useEffect(() => {
    if (!hasStarted || prefersReducedMotion()) return undefined;

    let frameId;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(easeOutCubic(t));
      if (t < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [hasStarted, durationMs]);

  return progress;
};

const formatPercent = (value) => {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
};


const SpeakingSpeedCard = ({ diffPercent = 12, active = true, onDetail }) => {
  const progress = useRevealProgress(active, ANIMATION_DURATION_MS);
  const angle = toGaugeAngle(diffPercent) * progress;
  const radians = (angle * Math.PI) / 180;

  const fillEnd = 180 + angle;
  const gaugeBackground = `conic-gradient(from 90deg at 50% 100%, #fff1ef 0deg, #fff1ef 180deg, #ff8d77 ${fillEnd}deg, #ffffff ${fillEnd + 1.4}deg, #fff1ef 359.36deg, #fff1ef 360deg)`;

  return (
    <section className="flex w-full flex-col items-center h-full gap-[16px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[44px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
      <div className="flex w-full flex-col">
        <p className="text-caption text-[#bfbfbf]">최근 n회 분석 기준</p>
        <div className="flex w-full items-center justify-between">
          <h3 className="text-title-semibold flex-1 text-black">말하는 속도</h3>
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
        <div
          className="absolute top-0 left-[19px] h-[126px] w-[252px]"
          style={{ clipPath: `path("${GAUGE_PATH}")`, background: gaugeBackground }}
        />
        <svg
          className="absolute top-0 left-[19px] h-[126px] w-[252px] overflow-visible"
          viewBox="0 0 252 126"
          aria-hidden="true"
        >
          <line
            x1={GAUGE_RADIUS}
            y1={GAUGE_RADIUS}
            x2={GAUGE_RADIUS - NEEDLE_LENGTH * Math.cos(radians)}
            y2={GAUGE_RADIUS - NEEDLE_LENGTH * Math.sin(radians)}
            stroke="white"
            strokeWidth="2.5"
          />
        </svg>

        <p className="text-label-small absolute top-[133px] left-[30px] whitespace-nowrap text-[#262626]">
          느림
        </p>
        <p className="text-label-small absolute top-[133px] left-[237px] whitespace-nowrap text-[#262626]">
          빠름
        </p>
        <div className="absolute top-[76px] left-1/2 flex w-[106px] -translate-x-1/2 flex-col items-center text-center text-[#262626]">
          <p className="text-heading w-full">{formatPercent(diffPercent * progress)}</p>
          <p className="text-body w-full">전체 사용자 평균</p>
        </div>
      </div>
    </section>
  );
};

export default SpeakingSpeedCard;
