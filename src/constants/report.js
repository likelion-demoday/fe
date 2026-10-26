import explainerImage from "../assets/images/character-explainer.png";
import superEgenImage from "../assets/images/character-super-egen.png";

// 화자별 색 (나: 주황, 상대: 파랑)
export const SPEAKER_TONES = {
  me: {
    text: "text-[#ff765b]",
    track: "from-white to-[#fff1ef]",
    fill: "from-[#ffe2d8] to-[#ff8d77]",
  },
  partner: {
    text: "text-[#6d8cff]",
    track: "from-white to-[#f0f4ff]",
    fill: "from-[#c3d0ff] to-[#6d8cff]",
  },
};

// relationshipType(scenario) → 보고서 상단 태그
export const SCENARIO_LABELS = {
  FRIEND_DAILY: { type: "일상 중심", relation: "친구 사이" },
  COUPLE_DAILY: { type: "일상 중심", relation: "연인 사이" },
  COUPLE_CONFLICT: { type: "갈등 중심", relation: "연인 사이" },
  PARENT_CHILD_CONFLICT: { type: "갈등 중심", relation: "부모 • 자녀 사이" },
};

// 자주 쓰는 표현 카테고리 (표시 순서대로)
export const EXPRESSION_CATEGORIES = [
  { key: "SPEECH_HABIT", label: "필러 표현" },
  { key: "EMPHASIS", label: "강조 표현" },
  { key: "WORD", label: "단어" },
];

// 관심을 보인 방식: 그룹별 patterns 카테고리 · 요약에 쓸 observations 카테고리
export const INTEREST_GROUPS = [
  {
    title: "맞장구 • 공감",
    patterns: ["SHORT_RESPONSE", "REPEAT_OR_CONFIRM", "SITUATION_ACKNOWLEDGEMENT"],
    observations: ["BACKCHANNEL", "EMPATHY"],
  },
  {
    title: "질문",
    patterns: ["FOLLOW_UP_QUESTION", "EMOTION_QUESTION"],
    observations: ["QUESTION"],
  },
];

// 표독력: 표현에서 보이는 것 / 내용에서 보이는 것
export const SPICINESS_AXIS_CATEGORIES = [
  "SWEAR_WORD",
  "DIRECTNESS",
  "EXPRESSION_INTENSITY",
  "SOFTENING_EXPRESSION",
];
export const SPICINESS_CONTEXT_CATEGORIES = ["ATTACK_TARGET", "PLAYFUL_CONTEXT", "RECOVERY_EXPRESSION"];

export const REACTION_TYPES = { THINKING: "T", FEELING: "F", MIXED: "T/F" };

// TODO: 캐릭터 이미지 API 연동 전 임시 카드 스타일 (나/상대 고정)
export const CHARACTER_STYLES = {
  me: {
    titleColor: "#3d465d",
    background: "linear-gradient(146.42deg, #fff 40.138%, #c2c5d9 89.392%)",
    image: explainerImage,
    imageBox: "top-[44.1px] left-[15.56px] size-[156.515px]",
    shadowBox: "top-[171.33px] left-[59.5px] h-[12.814px] w-[68.647px]",
  },
  partner: {
    titleColor: "#c8b9cd",
    background: "linear-gradient(154.64deg, #fff 43.136%, #e2d6e6 87.54%)",
    image: superEgenImage,
    imageBox: "top-[42.81px] left-[39.16px] h-[156.089px] w-[124.916px]",
    shadowBox: "top-[172.94px] left-[44.1px] h-[12.995px] w-[69.614px]",
  },
};
