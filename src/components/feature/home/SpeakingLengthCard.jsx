import { useId } from "react";

import trackImage from "../../../assets/icons/speaking-length-track.svg";
import useRevealProgress from "../../../hooks/useRevealProgress";


// 회색 트랙과 같은 path를 구간별로 나눠 경로를 따라 그라데이션을 입힌다
const FILL_SEGMENTS = [
  { d: "M4 4H230.5", cap: "round", x1: 4, y1: 4, x2: 230.5, y2: 4, from: "#FFF0EF", to: "#FFDBD1" },
  { d: "M230.5 4C236.023 4 240.5 8.47715 240.5 14C240.5 19.5228 236.023 24 230.5 24", x1: 0, y1: 4, x2: 0, y2: 24, from: "#FFDBD1", to: "#FFC2B2" },
  { d: "M230.5 24H14", x1: 230.5, y1: 0, x2: 14, y2: 0, from: "#FFC2B2", to: "#FFAA96" },
  { d: "M14 24C8.47715 24 4 28.4772 4 34C4 39.5228 8.47715 44 14 44", x1: 0, y1: 24, x2: 0, y2: 44, from: "#FFAA96", to: "#FF9177" },
  { d: "M14 44H70.5", cap: "round", x1: 14, y1: 0, x2: 70.5, y2: 0, from: "#FF9177", to: "#FF765B" },
  // 피그마 샘플(+12%)보다 길면 같은 색으로 트랙 끝까지 이어짐
  {
    d: "M70.5 44H230.5C236.023 44 240.5 48.4772 240.5 54C240.5 59.5228 236.023 64 230.5 64H14C8.47715 64 4 68.4771 4 74C4 79.5229 8.47715 84 14 84H240.5",
    cap: "round",
    x1: 70.5,
    y1: 0,
    x2: 240.5,
    y2: 0,
    from: "#FF765B",
    to: "#FF765B",
  },
];
const FILL_PATH =
  "M4 4H230.5C236.023 4 240.5 8.47715 240.5 14C240.5 19.5228 236.023 24 230.5 24H14C8.47715 24 4 28.4772 4 34C4 39.5228 8.47715 44 14 44H230.5C236.023 44 240.5 48.4772 240.5 54C240.5 59.5228 236.023 64 230.5 64H14C8.47715 64 4 68.4771 4 74C4 79.5229 8.47715 84 14 84H240.5";
// 비교 기준이 되는 사람들의 평균 발화 길이
const REFERENCE_DURATION_MS = 4000;
// 서버 값이 없을 때 보여주는 목데이터 (피그마 샘플)
const MOCK_DIFF_PERCENT = 12;
const ANIMATION_DURATION_MS = 1200;
// 피그마에서 +12%일 때 막대가 트랙 전체에서 차지하는 비율 (562.3 / 1228.2)
const SAMPLE_FILL_RATIO = 0.4578;

const toDiffPercent = (durationMs) =>
  ((Number(durationMs) - REFERENCE_DURATION_MS) / REFERENCE_DURATION_MS) * 100;

// 막대는 말하는 길이에 비례하고, 피그마 샘플(+12%)과 같은 지점을 기준으로 삼음
const toFillRatio = (diffPercent) =>
  Math.min(1, Math.max(0, (SAMPLE_FILL_RATIO * (100 + diffPercent)) / (100 + MOCK_DIFF_PERCENT)));

const formatPercent = (value) => {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
};

// durationMs: 평균 발화 길이(ms). 서버가 아직 안 주거나 null이면 목데이터 표시
const SpeakingLengthCard = ({ count, durationMs, active = true }) => {
  const progress = useRevealProgress(active, ANIMATION_DURATION_MS);
  const maskId = useId();
  const diffPercent = durationMs != null ? toDiffPercent(durationMs) : MOCK_DIFF_PERCENT;
  const fillRatio = toFillRatio(diffPercent);

  return (
    <section className="flex w-full flex-col items-center h-full gap-[16px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[44px] shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_49.1px_0px_rgba(0,0,0,0.1)]">
      <div className="flex w-full flex-col">
        <p className="text-caption text-[#bfbfbf]">최근 {count}회 분석 기준</p>
        <div className="flex w-full items-center justify-between">
          <h3 className="text-title-semibold flex-1 text-black">말하는 길이</h3>
        </div>
      </div>

      <div className="relative h-[154px] w-[290px] shrink-0">
        <div className="absolute top-[5px] left-1/2 flex w-max -translate-x-1/2 flex-col items-center text-center text-[#262626]">
          <p className="text-heading w-full">{formatPercent(diffPercent * progress)}</p>
          <p className="text-body w-full">한국어 일상 대화 평균</p>
        </div>
        <img
          src={trackImage}
          alt=""
          className="absolute top-[61px] left-[23px] block h-[88px] w-[244.5px] max-w-none"
        />
        <svg
          className="absolute top-[61px] left-[23px] block h-[88px] w-[244.5px]"
          viewBox="0 0 244.5 88"
          aria-hidden="true"
          style={{ opacity: progress > 0 ? 1 : 0 }}
        >
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="244.5" height="88">
            <path
              d={FILL_PATH}
              pathLength="1"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * fillRatio} 1`}
            />
          </mask>
          <defs>
            {FILL_SEGMENTS.map(({ x1, y1, x2, y2, from, to }, i) => (
              <linearGradient
                key={i}
                id={`${maskId}-g${i}`}
                gradientUnits="userSpaceOnUse"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
              >
                <stop offset="0" stopColor={from} />
                <stop offset="1" stopColor={to} />
              </linearGradient>
            ))}
          </defs>
          <g mask={`url(#${maskId})`} fill="none" strokeWidth="8">
            {FILL_SEGMENTS.map(({ d, cap = "butt" }, i) => (
              <path key={i} d={d} stroke={`url(#${maskId}-g${i})`} strokeLinecap={cap} />
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
};

export default SpeakingLengthCard;
