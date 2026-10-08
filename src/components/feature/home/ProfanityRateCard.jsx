import { useState } from "react";

import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import emoji1Off from "../../../assets/icons/profanity-emoji-1-off.svg";
import emoji1On from "../../../assets/icons/profanity-emoji-1-on.svg";
import emoji2Off from "../../../assets/icons/profanity-emoji-2-off.svg";
import emoji2On from "../../../assets/icons/profanity-emoji-2-on.svg";
import emoji3Off from "../../../assets/icons/profanity-emoji-3-off.svg";
import emoji3On from "../../../assets/icons/profanity-emoji-3-on.svg";
import emoji4Off from "../../../assets/icons/profanity-emoji-4-off.svg";
import emoji4On from "../../../assets/icons/profanity-emoji-4-on.svg";
import emoji5Off from "../../../assets/icons/profanity-emoji-5-off.svg";
import emoji5On from "../../../assets/icons/profanity-emoji-5-on.svg";


const LEVELS = [
  { max: 1, off: emoji1Off, on: emoji1On },
  { max: 5, off: emoji2Off, on: emoji2On },
  { max: 8, off: emoji3Off, on: emoji3On },
  { max: 10, off: emoji4Off, on: emoji4On },
  { max: Infinity, off: emoji5Off, on: emoji5On },
];


const EMOJI_STEP = 52;
const EMOJI_CENTER = 23.5;

const getLevelIndex = (rate) => LEVELS.findIndex(({ max }) => rate <= max);

// 처음 보일 때: 회색 이모지가 왼쪽부터 차례로 등장 → 해당 구간 이모지가 주황색으로 튀어 오름 → 퍼센트 등장
const POP_EASING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const POP_MS = 350;
const STAGGER_MS = 70;
const HIGHLIGHT_DELAY_MS = STAGGER_MS * (LEVELS.length - 1) + POP_MS;
const LABEL_DELAY_MS = HIGHLIGHT_DELAY_MS + 120;

const popStyle = (revealed, delayMs) => ({
  opacity: revealed ? 1 : 0,
  transform: revealed ? "scale(1)" : "scale(0.6)",
  transition: `opacity ${POP_MS}ms ease-out ${delayMs}ms, transform ${POP_MS}ms ${POP_EASING} ${delayMs}ms`,
});

/**
 * @param rate 비속어 사용률(%). null이면 강조 없이 회색 이모지만 표시 (디자인의 default 상태)
 * @param active 캐러셀에서 이 카드가 보이는지 여부 (처음 보일 때 한 번 재생)
 */
const ProfanityRateCard = ({ rate = 0.2, active = true, onDetail }) => {
  const activeIndex = rate === null ? -1 : getLevelIndex(rate);
  const [revealed, setRevealed] = useState(active);
  if (active && !revealed) setRevealed(true);

  return (
    <section className="flex h-full w-full flex-col items-center gap-[16px] rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[16px] pb-[44px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
      <div className="flex w-full flex-col">
        <p className="text-caption text-[#bfbfbf]">최근 n회 분석 기준</p>
        <div className="flex w-full items-center justify-between">
          <h3 className="text-title-semibold flex-1 text-black">비속어 사용률</h3>
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
        <div className="absolute top-[57px] left-[18px] flex items-center gap-[5px]">
          {LEVELS.map(({ off, on }, index) => (
            <div
              key={off}
              className="relative size-[47px] shrink-0 motion-reduce:transition-none"
              style={popStyle(revealed, STAGGER_MS * index)}
            >
              <img src={off} alt="" className="absolute inset-0 block size-full max-w-none" />
              {index === activeIndex && (
                <img
                  src={on}
                  alt=""
                  className="absolute inset-0 block size-full max-w-none motion-reduce:transition-none"
                  style={popStyle(revealed, HIGHLIGHT_DELAY_MS)}
                />
              )}
            </div>
          ))}
          {activeIndex >= 0 && (
            <p
              className="text-heading absolute top-[-30px] text-center whitespace-nowrap text-[#ff765b] motion-reduce:transition-none"
              style={{
                left: EMOJI_CENTER + EMOJI_STEP * activeIndex,
                opacity: revealed ? 1 : 0,
                transform: `translate(-50%, ${revealed ? 0 : 8}px)`,
                transition: `opacity 300ms ease-out ${LABEL_DELAY_MS}ms, transform 300ms ease-out ${LABEL_DELAY_MS}ms`,
              }}
            >
              {rate}%
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfanityRateCard;
