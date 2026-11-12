import CharacterImage from "../character/CharacterImage";
import { useEffect, useRef, useState } from "react";

import cardBg from "../../../assets/icons/character-card-bg-large.svg";
import { getAnalyses, getAnalysisReport } from "../../../api/analysis";
import { getCharacterImageStatus, getCharacterImages } from "../../../api/character";
import { CHARACTER_STYLES } from "../../../constants/report";
import { resolveRoles } from "../../../utils/reportMapper";
import CharacterShareSheet from "../character/CharacterShareSheet";

// 배경(서버 색상 그라데이션 + 위쪽 흰 물결)은 프론트에서 그리고, 배경 투명 캐릭터 이미지를 아래쪽에 올림
// 보고서와 이미지 상태는 같이 요청하고, 이미지 파일은 '나'의 것만 내려받음 (상대 이미지는 홈에서 안 씀)
const loadCharacter = async ({ recordingId }) => {
  const [analysis, status] = await Promise.all([
    getAnalysisReport(recordingId),
    getCharacterImageStatus(recordingId),
  ]);
  // 부모·자녀 분석은 SELF 대신 CHILD/PARENT로 와서 보고서와 같은 기준으로 '나'를 정함
  const myRole =
    resolveRoles(analysis.report?.recordingInfo?.speakers).me?.speakerRole ??
    "SELF";
  const insight = analysis.report?.qualitativeAnalysis?.characterInsights?.find(
    (item) => item.speakerRole === myRole,
  );
  if (!insight) return null;
  const images = await getCharacterImages(recordingId, { roles: [myRole], status });
  if (!images[myRole]) return null;

  return {
    ...CHARACTER_STYLES.me,
    ...images[myRole],
    id: recordingId,
    name: insight.name,
    description: insight.description,
  };
};

const SIDE_SCALE = 130 / 186;
const POSITIONS = [
  { x: -160, y: 51, scale: SIDE_SCALE * 0.8 },
  { x: -76, y: 49, scale: SIDE_SCALE },
  { x: 0, y: 0, scale: 1 },
  { x: 141, y: 53, scale: SIDE_SCALE },
  { x: 225, y: 51, scale: SIDE_SCALE * 0.8 },
];
const MOTION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const MOTION_DURATION = 650;
const DRAG_DISTANCE = 140;

// 드래그 중에도 위치·크기·블러를 같은 진행률로 보간한다.
const getCardAppearance = (offset) => {
  const position = Math.max(0, Math.min(4, offset + 2));
  const start = Math.floor(position);
  const end = Math.min(4, start + 1);
  const progress = position - start;
  const interpolate = (key) =>
    POSITIONS[start][key] + (POSITIONS[end][key] - POSITIONS[start][key]) * progress;
  return {
    transform: `translate(${interpolate("x")}px, ${interpolate("y")}px) scale(${interpolate("scale")})`,
    distance: Math.min(1, Math.abs(offset)),
    opacity: Math.max(0, Math.min(1, 2 - Math.abs(offset))),
  };
};
const SWIPE_THRESHOLD = 40;

const CharacterCard = ({
  character,
  offset,
  dragX,
  isDragging,
  onSelect,
  onShare,
}) => {
  const isActive = offset === 0;
  const visualOffset = offset + dragX / DRAG_DISTANCE;
  const isVisible = Math.abs(offset) <= 1;
  const appearance = getCardAppearance(visualOffset);
  const transition = (properties) => isDragging ? "none" : properties
    .map((property) => `${property} ${MOTION_DURATION}ms ${MOTION_EASING}`)
    .join(", ");

  return (
    <article
      onClick={isActive ? onShare : onSelect}
      aria-hidden={!isVisible}
      className={`absolute top-0 left-[76px] h-[229px] w-[186px] origin-top-left overflow-clip rounded-[16px] border-[0.893px] border-[#eee] shadow-[0px_3.574px_10.454px_0px_rgba(0,0,0,0.05),0px_0px_42.62px_0px_rgba(0,0,0,0.05)] ${isActive ? "z-20" : "z-10"} cursor-pointer`}
      style={{
        transform: appearance.transform,
        opacity: appearance.opacity,
        transition: transition(["transform", "opacity"]),
        pointerEvents: isVisible ? "auto" : "none",
        backgroundImage: character.background,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          filter: `blur(${appearance.distance * 2.56}px)`,
          transition: transition(["filter"]),
        }}
      >
        <div className="absolute top-[-1.12px] left-[-1px] h-[124px] w-[191px]">
          <img
            src={cardBg}
            alt=""
            className="absolute inset-[-38.47%_-24.97%] block max-w-none"
          />
        </div>
        {/* 캐릭터는 카드 바닥에 붙이고, 이름·설명은 그 위에 겹쳐 표시 */}
        <CharacterImage
          src={character.imageUrl}
          alt={isActive ? `${character.name} 캐릭터` : ""}
          draggable={false}
          className="pointer-events-none absolute top-[65px] left-[29px] block size-[160px] max-w-none object-contain"
        />
        <div className="relative flex w-full flex-col gap-[6px] px-[16px] pt-[14px]">
          {/* 이름·설명은 서버가 길이를 줄이지 않으므로 이름은 한 줄 말줄임, 설명은 두 줄까지 (캐릭터 이미지를 가리지 않게) */}
          <h3
            className="truncate font-bold"
            style={{
              color: character.titleColor,
              fontSize: 16.083 + appearance.distance * (18 - 16.083),
              letterSpacing: `${0.6433 + appearance.distance * (0.72 - 0.6433)}px`,
              transition: transition(["font-size", "letter-spacing"]),
            }}
          >
            {character.name}
          </h3>
          <p className="line-clamp-2 w-[154px] text-[11.615px] font-medium tracking-[0.3485px] break-keep text-[#595959]">
            {character.description}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -inset-px bg-[rgba(255,255,255,0.3)]"
        style={{ opacity: appearance.distance, transition: transition(["opacity"]) }}
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
  const [shareCharacter, setShareCharacter] = useState(null);
  const dragStartX = useRef(null);
  const hasDragged = useRef(false);

  useEffect(() => {
    let active = true;

    // 목록 순서(최신순)대로 앞에서부터 준비된 카드까지만 보여줌
    // (뒤 카드가 먼저 준비돼도 순서가 바뀌지 않게, 앞 카드가 끝나야 이어서 표시)
    const results = [];
    let total = 0;
    const publish = () => {
      if (!active) return;
      const ready = [];
      for (let index = 0; index < total && index in results; index += 1) {
        if (results[index]) ready.push(results[index]);
      }
      setCharacters(ready);
    };

    const fetchCharacters = async () => {
      const pending = [];
      try {
        // 캐릭터가 있는 분석을 모두 보여주기 위해 목록을 끝까지 가져오되, 페이지를 받는 즉시 카드 준비를 시작
        for (let page = 0; ; page += 1) {
          const result = await getAnalyses({ page, size: 20 });
          (result.items ?? [])
            .filter((item) => item.analysisStatus === "COMPLETED")
            .forEach((item) => {
              const index = total;
              total += 1;
              pending.push(
                loadCharacter(item)
                  .catch(() => null)
                  .then((character) => {
                    results[index] = character;
                    publish();
                  }),
              );
            });
          if (!result.hasNext || !active) break;
        }
        await Promise.all(pending);
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

  if (!loaded && characters.length === 0) return <div className="h-[263px] w-[338px]" />;
  if (characters.length === 0) {
    return (
      <div className="flex h-[263px] w-[338px] justify-center">
        <div className="flex h-[229px] w-[186px] items-center justify-center rounded-[16px] border-[0.893px] border-[#eee] bg-white shadow-[0px_3.574px_10.454px_0px_rgba(0,0,0,0.05),0px_0px_42.62px_0px_rgba(0,0,0,0.05)]">
          <p className="text-caption text-[#595959]">
            아직 분석된 대화가 없어요
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
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
            onShare={() => {
              if (!hasDragged.current) setShareCharacter(character);
            }}
          />
        ))}
      </div>
      {/* 시트는 포털이어도 이벤트가 캐러셀로 전달되므로 드래그 영역 밖에 둠 */}
      {shareCharacter && (
        <CharacterShareSheet
          character={shareCharacter}
          onClose={() => setShareCharacter(null)}
        />
      )}
    </>
  );
};

export default CharacterCarousel;
