import storyBg from "../assets/images/share-story-bg.svg";
import storyWave from "../assets/images/share-story-wave.svg";
import storyShadow from "../assets/images/share-story-shadow.svg";

// 캐릭터 공유·저장 이미지 (피그마 461 x 820 기준으로 그리고 1080 x 1920으로 저장)
// download: "다운로드용" (위에 로고) / story: "인스타 공유용"에서 로고만 뺀 것 (인스타 상단 UI에 로고가 가려져서)
const WIDTH = 461;
const HEIGHT = 820;
const OUTPUT_WIDTH = 1080;
const OUTPUT_HEIGHT = 1920;
const SCALE = OUTPUT_WIDTH / WIDTH;

const CARD_SIZE = { x: 25, width: 413.128, height: 508.637, radius: 35.538 };
const CARD_TOP = { download: 155, story: 135 };
const DEFAULT_COLORS = ["#ffffff", "#c3c5d9"];

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const roundRectPath = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

// CSS linear-gradient(각도) 와 같은 방향의 캔버스 그라데이션
const cssGradient = (ctx, { x, y, width, height }, angle, stops) => {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const half = (Math.abs(width * dx) + Math.abs(height * dy)) / 2;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const gradient = ctx.createLinearGradient(
    cx - dx * half,
    cy - dy * half,
    cx + dx * half,
    cy + dy * half,
  );
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  return gradient;
};

// 그림자는 캔버스 확대(scale)의 영향을 받지 않아서 직접 배율을 곱함
const withShadow = (ctx, { y = 0, blur, color }, draw) => {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowOffsetY = y * SCALE;
  ctx.shadowBlur = blur * SCALE;
  draw();
  ctx.restore();
};

const setText = (ctx, font, color, letterSpacing = 0) => {
  ctx.font = font;
  ctx.fillStyle = color;
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${letterSpacing}px`;
};

// 한 줄에 안 들어가면 어절 단위로 줄바꿈, maxLines 넘으면 말줄임
const wrapLines = (ctx, texts, maxWidth, maxLines) => {
  const lines = [];
  texts.forEach((text) => {
    let line = "";
    String(text)
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => {
        const next = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(next).width > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = next;
        }
      });
    if (line) lines.push(line);
  });
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last && ctx.measureText(`${last}…`).width > maxWidth)
    last = last.slice(0, -1);
  kept[maxLines - 1] = `${last}…`;
  return kept;
};

const FONTS = [
  "800 36px SUIT",
  "500 20px SUIT",
  "700 36px SUITE",
  "500 29px SUITE",
  "500 20px SUITE",
];

export const createCharacterStoryImage = async (
  character,
  variant = "download",
) => {
  const CARD = { ...CARD_SIZE, y: CARD_TOP[variant] };
  await Promise.all(
    FONTS.map((font) =>
      document.fonts?.load(font, "RE:SAY 가나다").catch(() => null),
    ),
  );
  const [bg, wave, shadow, characterImage] = await Promise.all(
    [storyBg, storyWave, storyShadow, character.imageUrl].map(loadImage),
  );

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = "middle";

  // 배경: 흰색 + 아래쪽 주황 번짐
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(bg, -136.63, 80.25, 734.266, 794.259);

  // 로고 RE:SAY (다운로드용만)
  let logoX = 25;
  if (variant === "download") {
    [
      ["RE", "#000", -1.4159],
      [":S", "#ff765b", -0.8],
      ["AY", "#000", -1.28],
    ].forEach(([text, color, spacing]) => {
      setText(ctx, "800 35.396px SUIT", color, spacing);
      ctx.fillText(text, logoX, 45.8);
      logoX += ctx.measureText(text).width;
    });
  }

  // 카드 그림자 + 배경
  const { x, y, width, height, radius } = CARD;
  [
    { y: 7.938, blur: 23.219, color: "rgba(0,0,0,0.05)" },
    { blur: 94.663, color: "rgba(0,0,0,0.05)" },
  ].forEach((shadowStyle) =>
    withShadow(ctx, shadowStyle, () => {
      roundRectPath(ctx, x, y, width, height, radius);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }),
  );

  ctx.save();
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.clip();
  const [from, to] = character.gradientColors ?? DEFAULT_COLORS;
  ctx.fillStyle = cssGradient(ctx, CARD, 146.42, [
    [0.40138, from],
    [0.89392, to],
  ]);
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = cssGradient(ctx, CARD, 146.42, [
    [0.40138, "#fff"],
    [0.89392, "rgba(255,255,255,0)"],
  ]);
  ctx.fillRect(x, y, width, height);
  ctx.drawImage(wave, x - 111.29, y - 111.57, 642.348, 493.533);

  // 이름 · 설명
  setText(ctx, "700 35.722px SUITE", character.titleColor ?? "#3d465d", 1.4289);
  ctx.fillText(character.name ?? "", x + 35.538, y + 53.6, width - 71);
  setText(ctx, "500 28.875px SUITE", "#595959", 0.8662);
  const description = Array.isArray(character.description)
    ? character.description
    : [character.description ?? ""];
  wrapLines(ctx, description, width - 71, 2).forEach((line, index) => {
    ctx.fillText(line, x + 35.538, y + 107.4 + index * 36);
  });

  // 캐릭터 + 발밑 그림자
  ctx.drawImage(shadow, x + 141.05, y + 428.3, 199.87, 56.458);
  ctx.drawImage(characterImage, x + 39.98, y + 113.28, 402.023, 402.023);
  ctx.restore();

  roundRectPath(
    ctx,
    x + 0.99,
    y + 0.99,
    width - 1.985,
    height - 1.985,
    radius - 0.99,
  );
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 1.985;
  ctx.stroke();

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("공유 이미지를 만들지 못했어요.");
  return new File([blob], "resay-character.png", { type: "image/png" });
};
