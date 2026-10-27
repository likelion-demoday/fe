import { useId } from "react";

import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import trackImage from "../../../assets/icons/speaking-length-track.svg";
import fillImage from "../../../assets/icons/speaking-length-fill.svg";
import useRevealProgress from "../../../hooks/useRevealProgress";


const FILL_PATH =
  "M4 4H230.5C236.023 4 240.5 8.47715 240.5 14C240.5 19.5228 236.023 24 230.5 24H14C8.47715 24 4 28.4772 4 34C4 39.5228 8.47715 44 14 44H70.5";
const DIFF_PERCENT = 12;
const ANIMATION_DURATION_MS = 1200;

const SpeakingLengthCard = ({ count, active = true, onDetail }) => {
  const progress = useRevealProgress(active, ANIMATION_DURATION_MS);
  const maskId = useId();

  return (
    <section className="flex w-full flex-col items-center h-full gap-[16px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[44px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
      <div className="flex w-full flex-col">
        <p className="text-caption text-[#bfbfbf]">최근 {count}회 분석 기준</p>
        <div className="flex w-full items-center justify-between">
          <h3 className="text-title-semibold flex-1 text-black">말하는 길이</h3>
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
        <div className="absolute top-[5px] left-1/2 flex w-[106px] -translate-x-1/2 flex-col items-center text-center text-[#262626]">
          <p className="text-heading w-full">+{Math.round(DIFF_PERCENT * progress)}%</p>
          <p className="text-body w-full">전체 사용자 평균</p>
        </div>
        <img
          src={trackImage}
          alt=""
          className="absolute top-[61px] left-[23px] block h-[88px] w-[244.5px] max-w-none"
        />
        <svg
          className="absolute top-[61px] left-[23px] block h-[48px] w-[244.5px]"
          viewBox="0 0 244.5 48"
          aria-hidden="true"
          style={{ opacity: progress > 0 ? 1 : 0 }}
        >
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="244.5" height="48">
            <path
              d={FILL_PATH}
              pathLength="1"
              fill="none"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${progress} 1`}
            />
          </mask>
          <image href={fillImage} width="244.5" height="48" mask={`url(#${maskId})`} />
        </svg>
      </div>
    </section>
  );
};

export default SpeakingLengthCard;
