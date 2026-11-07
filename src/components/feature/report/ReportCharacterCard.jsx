import cardBg from "../../../assets/icons/character-card-bg-medium.svg";
import { CARD_SHADOW } from "./ReportBlocks";

// 잠금·생성중 카드 배경 (피그마: 흰색 → #CBCBCB)
const PLACEHOLDER_BACKGROUND = "linear-gradient(145deg, #fff 40.2%, #cbcbcb 89.4%)";
// 자물쇠 버튼 · 생성중 알약 공통 그림자 (피그마)
const BADGE_SHADOW = "shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1),0px_4px_11.7px_0px_rgba(0,0,0,0.05)]";

// 피그마 lock 아이콘 (38px: 흐린 흰 원 + 회색 자물쇠)
const LockIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
    <path d="M12.25 19V15.5a6.75 6.25 0 0 1 13.5 0V19" stroke="#bfbfbf" strokeWidth="2.5" />
    <rect x="12" y="19" width="15" height="9" rx="0.75" fill="#bfbfbf" />
    <rect x="11" y="19" width="2" height="8" fill="#d9d9d9" />
  </svg>
);

// 닉네임 + 캐릭터 카드 (디자인 기준 카드 160.839 x 198.022)
// 배경(그라데이션 + 위쪽 흰 물결)은 프론트에서 그리고, imageUrl(배경 투명 캐릭터)을 아래쪽에 올림
// locked(생성 전) · generating(생성중): 캐릭터 없이 회색 카드를 흐림 막으로 덮고 자물쇠 / "생성중..." 표시
// onShare: 캐릭터가 열린 카드를 누르면 공유 시트를 엶
const ReportCharacterCard = ({ nickname, nicknameColor, character, onUnlock, onShare }) => {
  const isPlaceholder = character.locked || character.generating;
  const shareable = !isPlaceholder && character.imageUrl && onShare;

  return (
    <div className={`flex shrink-0 flex-col items-start gap-[6px] rounded-[16px] border-[0.865px] border-[#eee] bg-white pt-[8px] ${CARD_SHADOW}`}>
      <p
        className="px-[10.377px] font-['SUIT',sans-serif] text-[16px] font-bold tracking-[-0.32px] whitespace-nowrap"
        style={{ color: nicknameColor }}
      >
        {nickname}
      </p>
      <div
        onClick={shareable ? onShare : undefined}
        role={shareable ? "button" : undefined}
        tabIndex={shareable ? 0 : undefined}
        aria-label={shareable ? `${character.name} 캐릭터 공유하기` : undefined}
        onKeyDown={shareable ? (e) => (e.key === "Enter" || e.key === " ") && onShare() : undefined}
        className={`relative ${shareable ? "cursor-pointer" : ""} h-[198.022px] w-[160.839px] overflow-clip rounded-[13.836px] shadow-[0px_-1.729px_9.04px_0px_rgba(0,0,0,0.05),0px_0px_36.854px_0px_rgba(0,0,0,0.05)]`}
        style={{ backgroundImage: isPlaceholder ? PLACEHOLDER_BACKGROUND : character.background }}
      >
        <div className="absolute top-[-0.97px] left-[-0.87px] h-[107.226px] w-[165.162px]">
          <img src={cardBg} alt="" className="absolute inset-[-38.47%_-24.97%] block max-w-none" />
        </div>
        {/* 홈 캐릭터 카드(186px 폭, 이미지 160px · 왼쪽 29 · 위 65)를 이 카드 폭(160.839px) 비율로 줄인 위치 */}
        {!isPlaceholder && character.imageUrl && (
          <img
            src={character.imageUrl}
            alt={`${character.name} 캐릭터`}
            className="pointer-events-none absolute top-[56.2px] left-[25.08px] block size-[138.35px] max-w-none object-contain"
          />
        )}
        <div
          className="relative flex w-full flex-col gap-[5.188px] px-[13.836px] pt-[12.106px]"
          aria-hidden={isPlaceholder || undefined}
        >
          {/* 이름·설명은 서버가 길이를 줄이지 않으므로 이름은 한 줄 말줄임, 설명은 두 줄까지 (캐릭터 이미지를 가리지 않게) */}
          <h3
            className="truncate text-[15.565px] font-semibold tracking-[0.6226px]"
            style={{ color: isPlaceholder ? "#555" : character.titleColor }}
          >
            {character.name}
          </h3>
          {/* description: 줄 단위 배열. 한 줄이 길면 카드 폭에 맞춰 줄바꿈 */}
          <p className="line-clamp-2 text-[11.241px] font-medium tracking-[0.3372px] break-keep text-[#595959]">
            {character.description.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        {isPlaceholder && (
          <>
            {/* 피그마: 흰색 30% + 배경 흐림(17.9) 막 */}
            <div className="pointer-events-none absolute -inset-px bg-white/30 backdrop-blur-[8.95px]" />
            {character.generating ? (
              <p
                role="status"
                className={`absolute top-[43.75%] left-1/2 -translate-x-1/2 rounded-[16px] bg-white px-[10px] py-[6px] text-[11.241px] font-medium tracking-[0.3372px] whitespace-nowrap text-[#262626] ${BADGE_SHADOW}`}
              >
                생성중...
              </p>
            ) : (
              <button
                type="button"
                onClick={onUnlock}
                aria-label={`${nickname} 캐릭터 잠금 해제`}
                className={`press-control absolute top-[38.5%] left-1/2 size-[38px] -translate-x-1/2 rounded-full ${BADGE_SHADOW}`}
              >
                <span className="absolute inset-0 rounded-full bg-white blur-[4px]" aria-hidden="true" />
                <span className="relative block">
                  <LockIcon />
                </span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportCharacterCard;
