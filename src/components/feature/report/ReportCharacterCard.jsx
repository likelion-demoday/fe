// 닉네임 + 캐릭터 카드 (디자인 기준 카드 160.839 x 198.022)
// imageUrl: 배경까지 포함된 카드 이미지 (위쪽이 비어 있어 이름·설명을 겹쳐 띄움). 생성 전이면 그라데이션 배경만
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
      style={{ backgroundImage: character.imageUrl ? undefined : character.background }}
    >
      {character.imageUrl && (
        <img
          src={character.imageUrl}
          alt={`${character.name} 캐릭터`}
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-cover"
        />
      )}
      <div className="absolute top-0 left-0 flex w-full flex-col gap-[5.188px] px-[13.836px] py-[12.106px]">
        <h3
          className="text-[15.565px] font-semibold tracking-[0.6226px] whitespace-nowrap"
          style={{ color: character.titleColor }}
        >
          {character.name}
        </h3>
        {/* description: 줄 단위 배열. 한 줄이 길면 카드 폭에 맞춰 줄바꿈 */}
        <p className="text-[11.241px] font-medium tracking-[0.3372px] break-keep text-[#595959]">
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
