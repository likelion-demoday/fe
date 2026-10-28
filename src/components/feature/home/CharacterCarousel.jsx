import { useEffect, useRef, useState } from "react";

import { getAnalyses, getAnalysisReport } from "../../../api/analysis";
import { getCharacterImageUrls } from "../../../api/character";

const TITLE_COLOR = "#3d465d";

// 카드 이미지는 배경까지 포함 (186 x 229 비율). 위쪽 공백에 이름·설명을 겹쳐 띄움
const loadCharacter = async ({ recordingId, createdAt }) => {
  const [analysis, imageUrls] = await Promise.all([
    getAnalysisReport(recordingId),
    getCharacterImageUrls(recordingId),
  ]);
  const insight = analysis.report?.qualitativeAnalysis?.characterInsights?.find(
    (item) => item.speakerRole === "SELF",
  );
  if (!insight || !imageUrls.SELF) return null;

  return {
    id: recordingId,
    name: insight.name,
    date: new Date(createdAt).toLocaleDateString("ko-KR"),
    description: insight.description,
    image: imageUrls.SELF,
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
      }}
    >
      <div
        className="absolute inset-0 transition-[filter] duration-500"
        style={{ filter: isActive ? "blur(0px)" : "blur(2.56px)" }}
      >
        <img
          src={character.image}
          alt={isActive ? `${character.name} 캐릭터` : ""}
          draggable={false}
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-cover"
        />

        <div className="absolute top-0 left-0 flex w-full flex-col gap-[6px] px-[16px] py-[14px]">
          <div className="flex w-full items-center justify-between whitespace-nowrap">
            <h3
              className={`font-bold transition-[font-size] duration-500 ${isActive ? "text-[16.083px] tracking-[0.6433px]" : "text-[18px] tracking-[0.72px]"}`}
              style={{ color: TITLE_COLOR }}
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
