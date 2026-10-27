import { useEffect, useRef, useState } from "react";

import cardBg from "../../../assets/icons/character-card-bg-large.svg";
import cardShadow from "../../../assets/icons/character-shadow-large.svg";
import { getAnalyses, getAnalysisReport } from "../../../api/analysis";
import { getCharacterImageBlob, getCharacterImageStatus } from "../../../api/character";

const CARD_STYLE = {
  titleColor: "#3d465d",
  gradientTo: "#c2c5d9",
  imageBox: "top-[51px] left-[18px] size-[181px]",
  shadowBox: "top-[198.13px] left-[68.81px] h-[14.819px] w-[79.386px]",
};

const loadCharacter = async ({ recordingId, createdAt }) => {
  const [analysis, imageStatus] = await Promise.all([
    getAnalysisReport(recordingId),
    getCharacterImageStatus(recordingId),
  ]);
  const insight = analysis.report?.qualitativeAnalysis?.characterInsights?.find(
    (item) => item.speakerRole === "SELF",
  );
  const image = imageStatus.images?.find((item) => item.speakerRole === "SELF");
  if (!insight || image?.status !== "COMPLETED") return null;

  const blob = await getCharacterImageBlob(image.contentUrl);
  return {
    ...CARD_STYLE,
    id: recordingId,
    name: insight.name,
    date: new Date(createdAt).toLocaleDateString("ko-KR"),
    description: insight.description,
    image: URL.createObjectURL(blob),
  };
};


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
          <p className="w-[154px] text-[11.615px] font-medium tracking-[0.3485px] break-keep text-[#595959]">
            {character.description}
          </p>
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
  const [characters, setCharacters] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);
  const hasDragged = useRef(false);

  useEffect(() => {
    let active = true;

    const fetchCharacters = async () => {
      try {
        const { items = [] } = await getAnalyses({ size: 3 });
        const list = await Promise.all(
          items
            .filter((item) => item.analysisStatus === "COMPLETED")
            .map((item) => loadCharacter(item).catch(() => null)),
        );
        if (active) setCharacters(list.filter(Boolean));
      } catch (error) {
        console.error(error.message);
      } finally {
        if (active) setLoaded(true);
      }
    };

    fetchCharacters();
    return () => {
      active = false;
    };
  }, []);

  const goTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(characters.length - 1, index)));
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
        (dx < 0 && activeIndex === characters.length - 1);
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

  if (!loaded) return <div className="h-[263px] w-[338px]" />;
  if (characters.length === 0) {
    return (
      <div className="flex h-[263px] w-[338px] justify-center">
        <div className="flex h-[229px] w-[186px] items-center justify-center rounded-[16px] border-[0.893px] border-[#eee] bg-white shadow-[0px_3.574px_10.454px_0px_rgba(0,0,0,0.05),0px_0px_42.62px_0px_rgba(0,0,0,0.05)]">
          <p className="text-caption text-[#595959]">아직 분석된 대화가 없어요</p>
        </div>
      </div>
    );
  }

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
      {characters.map((character, index) => (
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
