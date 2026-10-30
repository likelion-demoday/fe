import {
  CHARACTER_STYLES,
  EXPRESSION_CATEGORIES,
  INTEREST_GROUPS,
  METRIC_LABELS,
  REACTION_TYPES,
  SCENARIO_LABELS,
  SPICINESS_AXIS_CATEGORIES,
  SPICINESS_CONTEXT_CATEGORIES,
} from "../constants/report";

const QUESTION_PATTERNS = ["FOLLOW_UP_QUESTION", "EMOTION_QUESTION"];


const formatDuration = (ms = 0) => {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
};


const formatClock = (ms = 0) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};


const shareOf = (mine = 0, other = 0) => (mine + other > 0 ? (mine / (mine + other)) * 100 : 50);

const findByRole = (list = [], role) => list.find((item) => item.speakerRole === role);

const pickByCategory = (list = [], categories) =>
  list.filter((item) => categories.includes(item.category));

const sumCount = (list) => list.reduce((sum, { count = 0 }) => sum + count, 0);

// reportMetrics: 화자별 COUNT(횟수) · PERCENT(관찰 정도) 지표
const findMetric = (qualitative, role, type, unit) =>
  (qualitative.reportMetrics ?? []).find(
    (metric) => metric.speakerRole === role && metric.type === type && metric.unit === unit,
  );

const metricTitle = ({ type, title }) => title || METRIC_LABELS[type] || type;

const countOf = (qualitative, role, type) => findMetric(qualitative, role, type, "COUNT")?.value ?? 0;

const percentOf = (qualitative, role, type) => findMetric(qualitative, role, type, "PERCENT")?.value ?? 0;

// evidenceQuotes(대표 발화, 최대 3개) → 칩에 표시할 문장. 화면에는 보정된 displayContent 사용
const quoteTexts = (quotes = []) =>
  quotes.map(({ displayContent, originalContent }) => displayContent || originalContent).filter(Boolean);

const countItems = (qualitative, role, types) =>
  types
    .map((type) => findMetric(qualitative, role, type, "COUNT"))
    .filter(Boolean)
    .map((metric) => ({
      title: metricTitle(metric),
      count: metric.value,
      description: metric.description ?? "",
      examples: quoteTexts(metric.evidenceQuotes),
    }));

const percentAxes = (qualitative, role, types) =>
  types
    .map((type) => findMetric(qualitative, role, type, "PERCENT"))
    .filter(Boolean)
    .map((metric) => ({ label: metricTitle(metric), value: metric.value, description: metric.description ?? "" }));


const resolveRoles = (speakers = []) => {
  const me = speakers.find((s) => s.speakerRole === "SELF") ?? speakers[0];
  const partner = speakers.find((s) => s !== me);
  return { me, partner };
};

const RHYTHM_SUMMARIES = {
  "more-fast": { title: "말이 많고 빨라요", description: (p) => `${p}님보다 말을 많이, 빠르게 하는 편이에요.` },
  "more-slow": { title: "말이 많고 차분해요", description: (p) => `${p}님보다 말을 많이 하지만 천천히 말하는 편이에요.` },
  "less-fast": { title: "짧고 빠르게 받아줘요", description: (p) => `${p}님보다 말은 적지만 빠르게 반응하는 편이에요.` },
  "less-slow": { title: "말이 적고 차분해요", description: (p) => `${p}님의 이야기를 천천히 들어주는 편이에요.` },
};

const INTEREST_TITLES = {
  asked: "질문으로 상대에게 관심을 보여요",
  answered: "상대의 질문에 답하며 대화를 이어가요",
};

const spicinessTitle = (score = 0) => {
  if (score >= 70) return "표현이 센 편이에요";
  if (score >= 40) return "적당히 솔직한 편이에요";
  return "부드럽게 말하는 편이에요";
};

const toCharacter = (insight, key) => ({
  ...CHARACTER_STYLES[key],
  name: insight?.name ?? "",
  description: [insight?.description ?? ""],
});

const toStyle = (role, partnerRole, partnerName, quantitative, qualitative) => {
  const mine = findByRole(quantitative.speakers, role) ?? {};
  const other = findByRole(quantitative.speakers, partnerRole) ?? {};
  const speed = quantitative.speakingSpeedComparison ?? {};
  const isFaster = speed.fasterSpeakerRole === role;
  const speedDiff = Math.round(speed.percentDifference ?? 0);
  const insight = findByRole(qualitative.speakerInsights, role) ?? {};
  const ratio = Math.round(mine.speakingRatioPercent ?? 0);
  const talksMore = (mine.speakingRatioPercent ?? 0) >= (other.speakingRatioPercent ?? 0);
  const rhythmSummary = RHYTHM_SUMMARIES[`${talksMore ? "more" : "less"}-${isFaster ? "fast" : "slow"}`];

  return {
    rhythm: [
      { label: "발화 비중", value: `${ratio}%`, position: ratio, range: ["0%", "100%"] },
      {
        label: "평균 발화 길이",
        value: `${((mine.averageUtteranceDurationMs ?? 0) / 1000).toFixed(1)}초`,
        position: shareOf(mine.averageUtteranceDurationMs, other.averageUtteranceDurationMs),
        range: ["짧음", "긺"],
      },
      {
        label: "평균 발화 속도",
        value: `${isFaster ? "+" : "-"}${speedDiff}%`,
        position: shareOf(mine.syllablesPerSecond, other.syllablesPerSecond),
        range: ["느림", "빠름"],
      },
    ],
    rhythmSummary: { title: rhythmSummary.title, description: rhythmSummary.description(partnerName) },
    expressions: EXPRESSION_CATEGORIES.map(({ key, label }) => ({
      category: label,
      items: pickByCategory(insight.frequentExpressions, [key]).map(({ expression, count }) => ({
        word: expression,
        count,
      })),
    })).filter(({ items }) => items.length > 0),
    expressionSummary: insight.frequentExpressionSummary ?? { title: "", description: "" },
  };
};

const toInterest = (role, partnerRole, qualitative, chipsSpec) => {
  const insight = findByRole(qualitative.interestInsights, role) ?? {};
  const patterns = findByRole(qualitative.speakerInsights, role)?.patterns ?? [];
  const partnerPatterns = findByRole(qualitative.speakerInsights, partnerRole)?.patterns ?? [];
  const asked =
    sumCount(pickByCategory(patterns, QUESTION_PATTERNS)) >=
    sumCount(pickByCategory(partnerPatterns, QUESTION_PATTERNS));
  const affection = pickByCategory(insight.observations, ["AFFECTION_EXPRESSION"])[0];

  return {
    score: insight.score ?? 0,
    summary: { title: INTEREST_TITLES[asked ? "asked" : "answered"], description: insight.description ?? "" },
    groups: INTEREST_GROUPS.map((group) => ({
      title: group.title,
      items: pickByCategory(patterns, group.patterns).map(({ title, count, description, evidenceQuotes }) => ({
        title,
        count,
        description,
        examples: quoteTexts(evidenceQuotes),
      })),
      summary: pickByCategory(insight.observations, group.observations)[0],
    })).filter(({ items }) => items.length > 0),
    chips: {
      title: chipsSpec.title,
      caption: chipsSpec.caption,
      items: countItems(qualitative, role, chipsSpec.types).map(({ title, count }) => ({ label: title, count })),
      summary: affection,
    },
  };
};

const toExpression = (role, qualitative) => {
  const insight = findByRole(qualitative.spicinessInsights, role) ?? {};
  const toCard = ({ title, description }) => ({ title, description });

  return {
    score: insight.score ?? 0,
    summary: { title: spicinessTitle(insight.score), description: insight.description ?? "" },
    // 지표별 수치는 API에 없어서 막대 없이 설명만 표시
    axes: pickByCategory(insight.observations, SPICINESS_AXIS_CATEGORIES).map(({ title, description }) => ({
      label: title,
      description,
    })),
    contexts: pickByCategory(insight.observations, SPICINESS_CONTEXT_CATEGORIES).map(toCard),
  };
};

const findScenarioInsight = (qualitative, role, categories) =>
  (qualitative.scenarioInsights ?? []).find(
    ({ category, speakerRoles = [] }) =>
      categories.includes(category) && (speakerRoles.length === 0 || speakerRoles.includes(role)),
  );

const scenarioSummary = (qualitative, role, categories) => {
  const insight = findScenarioInsight(qualitative, role, categories);
  return insight && { title: insight.title, description: insight.description };
};

// 갈등 반응 · 질문/조언 탭 (관심도 화면 구성): 대응 경향 요약 + COUNT 지표 묶음
const toBehavior = (role, qualitative, { groups, chips }) => {
  const tendency = findByRole(qualitative.speakerTendencies, role);
  const groupList = groups
    .map(({ title, types, insights }) => ({
      title,
      items: countItems(qualitative, role, types),
      summary: scenarioSummary(qualitative, role, insights),
    }))
    .filter(({ items }) => items.length > 0);

  return {
    score: `${sumCount(groupList.flatMap(({ items }) => items))}회`,
    summary: { title: tendency?.label ?? "", description: tendency?.description ?? "" },
    groups: groupList,
    chips: {
      title: chips.title,
      caption: chips.caption,
      items: countItems(qualitative, role, chips.types).map(({ title, count }) => ({ label: title, count })),
      summary: scenarioSummary(qualitative, role, chips.insights),
    },
  };
};

// 표현 강도 · 갈등 표현 탭 (표독력 화면 구성): 표독력 점수·요약 + PERCENT 지표
const toIntensity = (role, qualitative, types) => ({
  ...toExpression(role, qualitative),
  axes: percentAxes(qualitative, role, types),
});

const evidenceText = ({ evidence = {} }) => evidence.displayContent || evidence.originalContent || "";

// 대표 발화(representativeEvidences)를 화자 선택별 말풍선으로. 선택한 화자의 발화를 강조
const evidenceQuotes = (qualitative, roles, specs) => {
  const evidences = qualitative.representativeEvidences ?? [];
  const build = (selectedRole) =>
    specs.flatMap(({ type, label }) =>
      evidences
        .filter((item) => item.type === type)
        .map((item) => ({
          label: typeof label === "function" ? label(item) : label,
          text: evidenceText(item),
          highlighted: item.speakerRole === selectedRole,
        })),
    );
  return { me: build(roles.me), partner: build(roles.partner) };
};

// 개선 제안은 모델이 만든 추천 문장 (실제 발화 아님)
const coachingQuotes = (qualitative) => {
  const quotes = [...(qualitative.coachingSuggestions ?? [])]
    .sort((a, b) => a.order - b.order)
    .map(({ title, suggestedPhrase }) => ({ label: title, text: suggestedPhrase, highlighted: true }));
  return { me: quotes, partner: quotes };
};

const hasQuotes = ({ quotes }) => quotes.me.length > 0 || quotes.partner.length > 0;

const toTf = (role, qualitative) => {
  const insight = findByRole(qualitative.reactionStyleInsights, role) ?? {};
  const isT = (insight.thinkingPercent ?? 0) >= (insight.feelingPercent ?? 0);
  const evidences = (qualitative.representativeEvidences ?? []).filter(
    (item) => item.type === "REACTION_STYLE_EXAMPLE" && item.speakerRole === role,
  );

  return {
    type: isT ? "T" : "F",
    percent: isT ? insight.thinkingPercent ?? 0 : insight.feelingPercent ?? 0,
    quotes: evidences.length > 0
      ? evidences.map((item) => ({ type: REACTION_TYPES[item.reactionCategory] ?? "T/F", text: evidenceText(item) }))
      : (insight.examples ?? []).map(({ category, title }) => ({
          type: REACTION_TYPES[category] ?? "T/F",
          text: title,
        })),
  };
};

// 시나리오별 reportMetrics 화면 배치 (API 명세의 시나리오별 세부 지표 기준)
const FRIEND_DAILY_CHIPS = {
  title: "호감 표현",
  caption: "대화에서 직접 드러난 표현만 세었어요",
  types: ["COMPLIMENT", "ENCOURAGEMENT", "CARING_EXPRESSION", "FRIENDLY_ADDRESS", "DIRECT_AFFECTION", "JOY_OR_GRATITUDE"],
};

const COUPLE_DAILY_CHIPS = {
  title: "애정 표현",
  caption: "대화에서 직접 확인되는 표현만 모았어요.",
  types: ["COMPLIMENT", "ENCOURAGEMENT", "CARING_EXPRESSION", "DIRECT_AFFECTION", "JOY_OR_GRATITUDE"],
};

const COUPLE_DAILY_AFFECTION = ["DIRECT_AFFECTION", "CARING_EXPRESSION", "COMPLIMENT_OR_ENCOURAGEMENT", "AFFECTIONATE_ADDRESS"];
const AFFECTION_CONTEXT_CATEGORIES = ["PLAYFUL_EXCHANGE", "COMMON_INTEREST", "TURNING_POINT"];

const COUPLE_CONFLICT_BEHAVIOR = {
  groups: [
    { title: "방어 · 회피", types: ["POSITION_EXPLANATION", "REBUTTAL", "AVOIDANCE"], insights: ["CONFLICT_POSITION"] },
    { title: "관계 회복", types: ["APOLOGY", "YIELDING", "EMOTION_CHECK"], insights: ["TURNING_POINT"] },
  ],
  chips: {
    title: "질문과 응답",
    caption: "대화에서 직접 확인되는 발화만 세었어요.",
    types: ["QUESTION", "MISSED_RESPONSE"],
    insights: ["MISSED_SIGNAL"],
  },
};
const COUPLE_CONFLICT_INTENSITY = ["DIRECT_EXPRESSION", "ASSERTIVE_EXPRESSION", "SOFTENING_EXPRESSION", "RECOVERY_EXPRESSION"];

const PARENT_CHILD_BEHAVIOR = {
  groups: [
    {
      title: "질문 · 조언",
      types: ["SITUATION_QUESTION", "CONCRETE_ADVICE", "EMOTION_CHECK"],
      insights: ["QUESTION_RESPONSE_STYLE"],
    },
    { title: "훈계로 바뀐 순간", types: ["ASSERTIVE_EXPRESSION", "EXPERIENCE_COMPARISON"], insights: ["CARE_EXPRESSION"] },
  ],
  chips: {
    title: "대화가 닫히는 신호",
    caption: "대화에서 확인되는 표현만 정리했어요.",
    types: [
      "SHORT_RESPONSE",
      "TOPIC_AVOIDANCE",
      "REBUTTAL",
      "EMOTION_EXPRESSION",
      "APOLOGY",
      "CHILD_EXPRESSION",
      "PARENT_CONFIRMATION",
    ],
    insights: ["CONVERSATION_OPENNESS"],
  },
};
const PARENT_CHILD_INTENSITY = ["ADVICE", "ASSERTIVE_EXPRESSION", "EMOTION_CHECK", "SOFTENING_EXPRESSION"];

// 서버 분석 문장에 화자 역할 코드(SELF, PARTNER 등)가 그대로 섞여 오는 경우가 있어 닉네임으로 바꿈
const ROLE_TOKEN = /(?<![A-Za-z_])(SELF|PARTNER|FRIEND|PARENT|CHILD)(?![A-Za-z_])([가는를와]?)/g;
const ENUM_VALUE = /^[A-Z0-9_]+$/;
// 실제 발화는 바꾸지 않음
const RAW_TEXT_KEYS = new Set(["originalContent", "displayContent"]);
// 받침 있는 이름 뒤에서는 가/는/를/와 → 이/은/을/과
const BATCHIM_PARTICLES = { 가: "이", 는: "은", 를: "을", 와: "과" };

const hasBatchim = (name) => {
  const code = name.charCodeAt(name.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
};

const replaceRoleTokens = (value, nameOf, key) => {
  if (typeof value === "string") {
    if (RAW_TEXT_KEYS.has(key) || ENUM_VALUE.test(value)) return value;
    return value.replace(ROLE_TOKEN, (_, role, particle) => {
      const name = nameOf(role);
      return name + (particle && hasBatchim(name) ? BATCHIM_PARTICLES[particle] : particle);
    });
  }
  if (Array.isArray(value)) return value.map((item) => replaceRoleTokens(item, nameOf, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceRoleTokens(v, nameOf, k)]));
  }
  return value;
};

// GET /api/v1/analyses/{id} 응답의 report → 보고서 화면 데이터
export const toReportView = (report) => {
  const recordingInfo = report.recordingInfo ?? {};
  const quantitative = report.quantitativeAnalysis ?? {};
  const { me, partner } = resolveRoles(recordingInfo.speakers);
  // SELF 또는 내 역할 코드면 내 닉네임, 그 외 역할 코드는 상대 닉네임
  const qualitative = replaceRoleTokens(report.qualitativeAnalysis ?? {}, (role) =>
    role === "SELF" || role === me?.speakerRole ? me?.speakerName ?? "나" : partner?.speakerName ?? "상대",
  );
  const meRole = me?.speakerRole;
  const partnerRole = partner?.speakerRole;
  const partnerName = partner?.speakerName ?? "상대";
  const topics = qualitative.topics ?? [];
  const longestTopic =
    topics.find((topic) => topic.longest) ?? [...topics].sort((a, b) => b.turnCount - a.turnCount)[0];
  const roles = { me: meRole, partner: partnerRole };
  const scenario = recordingInfo.scenario;
  const bySpeaker = (build) => ({ me: build(meRole), partner: build(partnerRole) });
  const nameOf = (role) => (role === meRole ? me?.speakerName ?? "나" : partnerName);
  const tendencyLabels = bySpeaker((role) => findByRole(qualitative.speakerTendencies, role)?.label ?? "");
  const coachingSection = (title) => ({
    title,
    scores: { me: "3단계", partner: "3단계" },
    quotes: coachingQuotes(qualitative),
  });

  const conflict = scenario === "COUPLE_CONFLICT" && {
    overviewScores: [
      { label: "직설 표현", ...bySpeaker((role) => percentOf(qualitative, role, "DIRECT_EXPRESSION")) },
      { label: "회복 시도", ...bySpeaker((role) => percentOf(qualitative, role, "RECOVERY_EXPRESSION")) },
    ],
    reaction: bySpeaker((role) => toBehavior(role, qualitative, COUPLE_CONFLICT_BEHAVIOR)),
    intensity: bySpeaker((role) => toIntensity(role, qualitative, COUPLE_CONFLICT_INTENSITY)),
    missed: [
      {
        title: "놓친 말",
        scores: bySpeaker((role) => `질문 ${countOf(qualitative, role, "QUESTION")}회`),
        quotes: evidenceQuotes(qualitative, roles, [
          { type: "EMOTION_EXPRESSION", label: "감정 표현" },
          { type: "MISSED_QUESTION", label: "놓친 질문" },
          { type: "FOLLOWING_RESPONSE", label: "이어진 반응" },
        ]),
      },
      {
        title: "갈등 반응 경향",
        scores: tendencyLabels,
        quotes: evidenceQuotes(qualitative, roles, [
          { type: "SPEAKER_REACTION", label: (item) => `${nameOf(item.speakerRole)}의 반응` },
          { type: "RECOVERY_START", label: "회복의 시작" },
        ]),
      },
      coachingSection("대화 개선 힌트"),
    ].filter(hasQuotes),
  };

  const affection = scenario === "COUPLE_DAILY" &&
    bySpeaker((role) => ({
      score: percentOf(qualitative, role, "DIRECT_AFFECTION"),
      summary: scenarioSummary(qualitative, role, ["AFFECTION_EXPRESSION"]) ??
        pickByCategory(findByRole(qualitative.interestInsights, role)?.observations, ["AFFECTION_EXPRESSION"])[0] ?? {
          title: "",
          description: "",
        },
      axes: percentAxes(qualitative, role, COUPLE_DAILY_AFFECTION),
      contexts: (qualitative.scenarioInsights ?? [])
        .filter(
          ({ category, speakerRoles = [] }) =>
            AFFECTION_CONTEXT_CATEGORIES.includes(category) &&
            (speakerRoles.length === 0 || speakerRoles.includes(role)),
        )
        .map(({ title, description }) => ({ title, description })),
    }));

  const parentConflict = scenario === "PARENT_CHILD_CONFLICT" && {
    overviewScores: [
      { label: "단정 표현", ...bySpeaker((role) => percentOf(qualitative, role, "ASSERTIVE_EXPRESSION")) },
      { label: "감정 확인", ...bySpeaker((role) => percentOf(qualitative, role, "EMOTION_CHECK")) },
    ],
    questionAdvice: bySpeaker((role) => toBehavior(role, qualitative, PARENT_CHILD_BEHAVIOR)),
    conflictExpression: bySpeaker((role) => toIntensity(role, qualitative, PARENT_CHILD_INTENSITY)),
    retry: [
      {
        title: "놓친 말",
        // 부모·자녀 역할이 SELF로 올 수 있어 화자별로 있는 지표로 판단
        scores: bySpeaker((role) =>
          findMetric(qualitative, role, "CHILD_EXPRESSION", "COUNT")
            ? `표현 ${countOf(qualitative, role, "CHILD_EXPRESSION")}회`
            : `확인 ${countOf(qualitative, role, "PARENT_CONFIRMATION")}회`,
        ),
        quotes: evidenceQuotes(qualitative, roles, [
          { type: "CHILD_POSITION", label: "자녀의 입장" },
          { type: "FOLLOWING_ADVICE", label: "이어진 조언" },
          { type: "UNASKED_QUESTION", label: "미처 못한 질문" },
        ]),
      },
      {
        title: "훈계로 바뀐 순간",
        scores: tendencyLabels,
        quotes: evidenceQuotes(qualitative, roles, [
          { type: "WORRY_START", label: "걱정의 시작" },
          { type: "EXPRESSION_TURNING_POINT", label: "표현이 바뀐 지점" },
          { type: "CLOSING_RESPONSE", label: "닫히는 대답" },
        ]),
      },
      coachingSection("다시 대화하기"),
    ].filter(hasQuotes),
  };

  const interestScore = {
    label: "관심도",
    me: findByRole(qualitative.interestInsights, meRole)?.score ?? 0,
    partner: findByRole(qualitative.interestInsights, partnerRole)?.score ?? 0,
  };
  const secondScore = affection
    ? { label: "애정지수", me: affection.me.score, partner: affection.partner.score }
    : {
        label: "표독력",
        me: findByRole(qualitative.spicinessInsights, meRole)?.score ?? 0,
        partner: findByRole(qualitative.spicinessInsights, partnerRole)?.score ?? 0,
      };
  const interestChips = scenario === "COUPLE_DAILY" ? COUPLE_DAILY_CHIPS : FRIEND_DAILY_CHIPS;

  return {
    duration: formatDuration(recordingInfo.durationMs),
    scenario: recordingInfo.scenario,
    ...(SCENARIO_LABELS[recordingInfo.scenario] ?? { type: "", relation: "" }),
    scenarioInsights: qualitative.scenarioInsights ?? [],
    speakers: {
      me: {
        role: meRole,
        nickname: me?.speakerName ?? "나",
        character: toCharacter(findByRole(qualitative.characterInsights, meRole), "me"),
      },
      partner: {
        role: partnerRole,
        nickname: partnerName,
        character: toCharacter(findByRole(qualitative.characterInsights, partnerRole), "partner"),
      },
    },
    overview: {
      scores: conflict?.overviewScores ?? parentConflict?.overviewScores ?? [interestScore, secondScore],
      summary: qualitative.overview ?? { title: "", description: "" },
    },
    info: {
      commonInterests: [...topics]
        .sort((a, b) => b.turnCount - a.turnCount)
        .slice(0, 3)
        .map(({ title }) => title),
      longestTopic: longestTopic && {
        title: longestTopic.title,
        duration: formatDuration(longestTopic.speakingDurationMs),
        description: longestTopic.description,
      },
      timeline: (qualitative.timeline ?? []).map(({ startMs, title, description }) => ({
        time: formatClock(startMs),
        title,
        description,
        keywords: [],
      })),
      topicTurns: topics.map(({ title, turnCount }) => ({ topic: title, turns: turnCount })),
      stats: {
        recordingTime: formatClock(recordingInfo.durationMs),
        turns: sumCount((quantitative.speakers ?? []).map(({ utteranceCount }) => ({ count: utteranceCount }))),
        topicCount: topics.length,
      },
    },
    style: {
      me: toStyle(meRole, partnerRole, partnerName, quantitative, qualitative),
      partner: toStyle(partnerRole, meRole, me?.speakerName ?? "나", quantitative, qualitative),
    },
    interest: {
      me: toInterest(meRole, partnerRole, qualitative, interestChips),
      partner: toInterest(partnerRole, meRole, qualitative, interestChips),
    },
    expression: {
      me: toExpression(meRole, qualitative),
      partner: toExpression(partnerRole, qualitative),
    },
    tf: {
      me: toTf(meRole, qualitative),
      partner: toTf(partnerRole, qualitative),
    },
    conflict: conflict || null,
    affection: affection || null,
    parentConflict: parentConflict || null,
  };
};
