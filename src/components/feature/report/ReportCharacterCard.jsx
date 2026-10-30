import cardBg from "../../../assets/icons/character-card-bg-medium.svg";

// 닉네임 + 캐릭터 카드 (디자인 기준 카드 160.839 x 198.022)
// 배경(그라데이션 + 위쪽 흰 물결)은 프론트에서 그리고, imageUrl(배경 투명 캐릭터)을 아래쪽에 올림
const ReportCharacterCard = ({ nickname, nicknameColor, character }) => (
  <div className="flex shrink-0 flex-col items-start gap-[6px] rounded-[16px] border-[0.865px] border-[#eee] bg-white pt-[8px] drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
    <p
      className="px-[10.377px] font-['SUIT',sans-serif] text-[16px] font-bold tracking-[-0.32px] whitespace-nowrap"
      style={{ color: nicknameColor }}
    >
      {nickname}
    </p>
    <div
      className="relative h-[198.022px] w-[160.839px] overflow-clip rounded-[13.836px] shadow-[0px_-1.729px_9.04px_0px_rgba(0,0,0,0.05),0px_0px_36.854px_0px_rgba(0,0,0,0.05)]"
      style={{ backgroundImage: character.background }}
    >
      <div className="absolute top-[-0.97px] left-[-0.87px] h-[107.226px] w-[165.162px]">
        <img src={cardBg} alt="" className="absolute inset-[-38.47%_-24.97%] block max-w-none" />
      </div>
      {/* 캐릭터는 카드 바닥에 붙이고, 이름·설명은 그 위에 겹쳐 표시 */}
      {character.imageUrl && (
        <img
          src={character.imageUrl}
          alt={`${character.name} 캐릭터`}
          className="pointer-events-none absolute bottom-0 left-1/2 block size-[156px] max-w-none -translate-x-1/2 object-contain"
        />
      )}
      <div className="relative flex w-full flex-col gap-[5.188px] px-[13.836px] pt-[12.106px]">
        {/* 이름·설명은 서버가 길이를 줄이지 않으므로 이름은 한 줄 말줄임, 설명은 두 줄까지 (캐릭터 이미지를 가리지 않게) */}
        <h3
          className="truncate text-[15.565px] font-semibold tracking-[0.6226px]"
          style={{ color: character.titleColor }}
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
    </div>
  </div>
);

export default ReportCharacterCard;
