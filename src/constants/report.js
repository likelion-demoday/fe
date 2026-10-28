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

// 캐릭터 카드 글자색 · 이미지 생성 전 배경 (나/상대 고정)
export const CHARACTER_STYLES = {
  me: {
    titleColor: "#3d465d",
    background: "linear-gradient(146.42deg, #fff 40.138%, #c2c5d9 89.392%)",
  },
  partner: {
    titleColor: "#c8b9cd",
    background: "linear-gradient(154.64deg, #fff 43.136%, #e2d6e6 87.54%)",
  },
};

// 섹션 제목 (연인·갈등 보고서는 "갈등 정보" 문구 사용)
export const INFO_LABELS = {
  content: "대화 내용",
  topics: "공통 관심사",
  longest: "가장 오래 대화한 이야기",
  timeline: "대화 타임라인",
  turns: "주제별 대화 턴 수",
};

export const CONFLICT_INFO_LABELS = {
  content: "갈등 내용",
  topics: "의견이 갈린 주제",
  longest: "가장 오래 머문 쟁점",
  timeline: "갈등 타임라인",
  turns: "쟁점별 대화 턴 수",
};
