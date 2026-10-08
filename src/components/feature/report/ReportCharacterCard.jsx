import cardBg from "../../../assets/icons/character-card-bg-medium.svg";
import cardShadow from "../../../assets/icons/character-shadow-medium.svg";

// 닉네임 + 캐릭터 카드 (디자인 기준 카드 160.839 x 198.022)
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
      <div className="absolute top-0 left-0 flex w-[160.706px] flex-col gap-[5.188px] px-[13.836px] py-[12.106px]">
        <h3
          className="text-[15.565px] font-semibold tracking-[0.6226px] whitespace-nowrap"
          style={{ color: character.titleColor }}
        >
          {character.name}
        </h3>
        <p className="text-[11.241px] font-medium tracking-[0.3372px] whitespace-nowrap text-[#595959]">
          {character.description[0]}
          <br />
          {character.description[1]}
        </p>
      </div>
      <div className={`absolute ${character.shadowBox}`}>
        <img src={cardShadow} alt="" className="absolute inset-[-35.77%_-6.68%] block max-w-none" />
      </div>
      <img
        src={character.image}
        alt={`${character.name} 캐릭터`}
        className={`pointer-events-none absolute max-w-none object-cover ${character.imageBox}`}
      />
    </div>
  </div>
);

export default ReportCharacterCard;
