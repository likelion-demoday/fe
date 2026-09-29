import { useRef, useState } from "react";

import cardBg from "../../../assets/icons/character-card-bg-large.svg";
import cardShadow from "../../../assets/icons/character-shadow-large.svg";
import superEgenImage from "../../../assets/images/character-super-egen.png";
import explainerImage from "../../../assets/images/character-explainer.png";

// TODO: API 연동 전 임시 데이터 (description/mission 일부는 디자인에 없어 임의 문구)
const CHARACTERS = [
  {
    id: "super-egen-1",
    name: "슈퍼에겐 아줌마",
    date: "2일전",
    titleColor: "#c8b9cd",
    gradientTo: "#e2d6e6",
    description: ["상대방의 감정에 집중하고", "리액션이 많아요"],
    mission: ["리액션 전에", "내 생각 먼저 말하기"],
    image: superEgenImage,
    imageBox: "top-[49px] left-[54px] h-[180.5px] w-[144.45px]",
    shadowBox: "top-[200px] left-[51px] h-[15.03px] w-[80.5px]",
  },
  {
    id: "explainer",
    name: "설명 보부상",
    date: "2일전",
    titleColor: "#3d465d",
    gradientTo: "#c2c5d9",
    description: ["묻지 않은 정보까지", "자세히 설명해줘요"],
    mission: ["상대방이 물어본", "정보만 이야기해보기"],
    image: explainerImage,
    imageBox: "top-[51px] left-[18px] size-[181px]",
    shadowBox: "top-[198.13px] left-[68.81px] h-[14.819px] w-[79.386px]",
  },
  {
    id: "super-egen-2",
    name: "슈퍼에겐 아줌마",
    date: "5일전",
    titleColor: "#c8b9cd",
    gradientTo: "#e2d6e6",
    description: ["상대방의 감정에 집중하고", "리액션이 많아요"],
    mission: ["리액션 전에", "내 생각 먼저 말하기"],
    image: superEgenImage,
    imageBox: "top-[49px] left-[54px] h-[180.5px] w-[144.45px]",
    shadowBox: "top-[200px] left-[51px] h-[15.03px] w-[80.5px]",
  },
];

// 디자인 기준: 가운데 카드 186x229, 옆 카드 130x160 (가운데 카드를 축소한 형태)
const SIDE_SCALE = 130 / 186;
const POSITIONS = {
  "-1": `translate(-76px, 49px) scale(${SIDE_SCALE})`,
  0: "translate(0px, 0px) scale(1)",
  1: `translate(141px, 53px) scale(${SIDE_SCALE})`,
};
const HIDDEN_POSITION = (offset) =>
  `translate(${offset < 0 ? -160 : 225}px, 51px) scale(${SIDE_SCALE * 0.8})`;
const SWIPE_THRESHOLD = 40;

const CharacterCard = ({ character, offset, dragX, isDragging, onSelect }) => {
  const isActive = offset === 0;
  const isVisible = Math.abs(offset) <= 1;
  const baseTransform = isVisible ? POSITIONS[offset] : HIDDEN_POSITION(offset);

  return (
    <article
      onClick={isActive ? undefined : onSelect}
      aria-hidden={!isVisible}
      className={`absolute top-0 left-[76px] h-[229px] w-[186px] origin-top-left overflow-clip rounded-[16px] border-[0.893px] border-[#eee] shadow-[0px_3.574px_10.454px_0px_rgba(0,0,0,0.05),0px_0px_42.62px_0px_rgba(0,0,0,0.05)] ${
        isDragging
          ? ""
          : "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      } ${isActive ? "z-20" : "z-10 cursor-pointer"}`}
      style={{
        transform: `translateX(${dragX}px) ${baseTransform}`,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        backgroundImage: `linear-gradient(146.42deg, #fff 40.14%, ${character.gradientTo} 89.39%)`,
      }}
    >
      {/* 옆 카드는 흐리게: 디자인의 backdrop-blur를 transform 안에서도 깨지지 않도록 filter로 대체 */}
      <div
        className="absolute inset-0 transition-[filter] duration-500"
        style={{ filter: isActive ? "blur(0px)" : "blur(2.56px)" }}
      >
        <div className="absolute top-[-1.12px] left-[-1px] h-[124px] w-[191px]">
          <img
            src={cardBg}
            alt=""
            className="absolute inset-[-38.47%_-24.97%] block max-w-none"
          />
        </div>

        <div className="absolute top-0 left-0 flex w-[185.846px] flex-col gap-[6px] px-[16px] py-[14px]">
          <div className="flex w-full items-center justify-between whitespace-nowrap">
            <h3
              className={`font-bold transition-[font-size] duration-500 ${isActive ? "text-[16.083px] tracking-[0.6433px]" : "text-[18px] tracking-[0.72px]"}`}
              style={{ color: character.titleColor }}
            >
              {character.name}
            </h3>
            <p className="text-[8.935px] font-medium tracking-[0.268px] text-[#bfbfbf]">
              {character.date}
            </p>
          </div>
          <div className="relative font-medium">
            <div
              className={`flex w-[95.604px] flex-col gap-[2px] transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
            >
              <p className="text-[8.935px] tracking-[0.268px] text-[#454545]">
                Mission!
              </p>
              <p className="text-[11.615px] tracking-[0.3485px] whitespace-nowrap text-[#262626]">
                {character.mission[0]}
                <br />
                {character.mission[1]}
              </p>
            </div>
            <p
              className={`absolute top-0 left-0 text-[13px] tracking-[0.39px] whitespace-nowrap text-[#595959] transition-opacity duration-300 ${isActive ? "opacity-0" : "opacity-100"}`}
            >
              {character.description[0]}
              <br />
              {character.description[1]}
            </p>
          </div>
        </div>

        <div className={`absolute ${character.shadowBox}`}>
          <img
            src={cardShadow}
            alt=""
            className="absolute inset-[-35.77%_-6.68%] block max-w-none"
          />
        </div>
        <img
          src={character.image}
          alt={isActive ? `${character.name} 캐릭터` : ""}
          draggable={false}
          className={`pointer-events-none absolute max-w-none object-cover ${character.imageBox}`}
        />
      </div>

      <div
        className={`pointer-events-none absolute -inset-px bg-[rgba(255,255,255,0.3)] transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-100"}`}
      />
    </article>
  );
};

const CharacterCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);
  const hasDragged = useRef(false);

  const goTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(CHARACTERS.length - 1, index)));
  };

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
    hasDragged.current = false;
  };

  const handlePointerMove = (e) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if (!isDragging && Math.abs(dx) > 5) {
      setIsDragging(true);
      hasDragged.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (isDragging) {
      const atEdge =
        (dx > 0 && activeIndex === 0) ||
        (dx < 0 && activeIndex === CHARACTERS.length - 1);
      setDragX(atEdge ? dx * 0.3 : dx);
    }
  };

  const handlePointerUp = () => {
    if (dragStartX.current === null) return;
    if (dragX <= -SWIPE_THRESHOLD) goTo(activeIndex + 1);
    else if (dragX >= SWIPE_THRESHOLD) goTo(activeIndex - 1);
    dragStartX.current = null;
    setIsDragging(false);
    setDragX(0);
  };

  return (
    <div
      className="relative h-[263px] w-[338px] touch-pan-y select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="region"
      aria-roledescription="carousel"
      aria-label="나의 캐릭터"
    >
      {CHARACTERS.map((character, index) => (
        <CharacterCard
          key={character.id}
          character={character}
          offset={index - activeIndex}
          dragX={dragX}
          isDragging={isDragging}
          onSelect={() => {
            if (!hasDragged.current) goTo(index);
          }}
        />
      ))}
    </div>
  );
};

export default CharacterCarousel;
