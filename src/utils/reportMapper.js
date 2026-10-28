import {
  CHARACTER_STYLES,
  EXPRESSION_CATEGORIES,
  INTEREST_GROUPS,
  REACTION_TYPES,
  SCENARIO_LABELS,
  SPICINESS_AXIS_CATEGORIES,
  SPICINESS_CONTEXT_CATEGORIES,
} from "../constants/report";
import { buildCoupleConflictMock } from "../mocks/coupleConflict";
import { buildCoupleDailyMock } from "../mocks/coupleDaily";
import { buildParentChildConflictMock } from "../mocks/parentChildConflict";

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

const toInterest = (role, partnerRole, qualitative) => {
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
      items: pickByCategory(patterns, group.patterns).map(({ title, count, description }) => ({
        title,
        count,
        description,
        examples: [],
      })),
      summary: pickByCategory(insight.observations, group.observations)[0],
    })).filter(({ items }) => items.length > 0),
    chips: { title: "호감 표현", caption: "대화에서 직접 드러난 표현만 세었어요", items: [], summary: affection },
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

// 시나리오 전용 탭은 임시 데이터 위에 API에 있는 문구·점수만 실제 값으로 덮어씀 (%·횟수·예시 발화는 API에 없음)
const findScenarioInsight = (qualitative, role, categories) =>
  (qualitative.scenarioInsights ?? []).find(
    ({ category, speakerRoles = [] }) =>
      categories.includes(category) && (speakerRoles.length === 0 || speakerRoles.includes(role)),
  );

const withScenarioSummary = (data, roles, qualitative, categories) => {
  const merge = (mock, role) => {
    const insight = findScenarioInsight(qualitative, role, categories);
    return insight ? { ...mock, summary: { title: insight.title, description: insight.description } } : mock;
  };
  return { me: merge(data.me, roles.me), partner: merge(data.partner, roles.partner) };
};

const withSpiciness = (data, roles, qualitative) => {
  const merge = (mock, role) => {
    if (!findByRole(qualitative.spicinessInsights, role)) return mock;
    const { score, summary, contexts } = toExpression(role, qualitative);
    return { ...mock, score, summary, contexts: contexts.length > 0 ? contexts : mock.contexts };
  };
  return { me: merge(data.me, roles.me), partner: merge(data.partner, roles.partner) };
};

const toTf = (role, qualitative) => {
  const insight = findByRole(qualitative.reactionStyleInsights, role) ?? {};
  const isT = (insight.thinkingPercent ?? 0) >= (insight.feelingPercent ?? 0);

  return {
    type: isT ? "T" : "F",
    percent: isT ? insight.thinkingPercent ?? 0 : insight.feelingPercent ?? 0,
    quotes: (insight.examples ?? []).map(({ category, title }) => ({
      type: REACTION_TYPES[category] ?? "T/F",
      text: title,
    })),
  };
};

// GET /api/v1/analyses/{id} 응답의 report → 보고서 화면 데이터
export const toReportView = (report) => {
  const recordingInfo = report.recordingInfo ?? {};
  const quantitative = report.quantitativeAnalysis ?? {};
  const qualitative = report.qualitativeAnalysis ?? {};
  const { me, partner } = resolveRoles(recordingInfo.speakers);
  const meRole = me?.speakerRole;
  const partnerRole = partner?.speakerRole;
  const partnerName = partner?.speakerName ?? "상대";
  const topics = qualitative.topics ?? [];
  const longestTopic =
    topics.find((topic) => topic.longest) ?? [...topics].sort((a, b) => b.turnCount - a.turnCount)[0];
  const roles = { me: meRole, partner: partnerRole };
  const conflictMock =
    recordingInfo.scenario === "COUPLE_CONFLICT"
      ? buildCoupleConflictMock(me?.speakerName ?? "나", partnerName)
      : null;
  const conflict = conflictMock && {
    ...conflictMock,
    reaction: withScenarioSummary(conflictMock.reaction, roles, qualitative, ["CONFLICT_POSITION", "CONFLICT_TOPIC"]),
    intensity: withSpiciness(conflictMock.intensity, roles, qualitative),
  };
  const coupleDailyMock = recordingInfo.scenario === "COUPLE_DAILY" ? buildCoupleDailyMock() : null;
  const coupleDaily = coupleDailyMock && {
    ...coupleDailyMock,
    affection: withScenarioSummary(coupleDailyMock.affection, roles, qualitative, ["AFFECTION_EXPRESSION"]),
  };
  const parentConflictMock =
    recordingInfo.scenario === "PARENT_CHILD_CONFLICT" ? buildParentChildConflictMock() : null;
  const parentConflict = parentConflictMock && {
    ...parentConflictMock,
    questionAdvice: withScenarioSummary(parentConflictMock.questionAdvice, roles, qualitative, [
      "QUESTION_RESPONSE_STYLE",
      "CONVERSATION_OPENNESS",
    ]),
    conflictExpression: withScenarioSummary(parentConflictMock.conflictExpression, roles, qualitative, [
      "CONFLICT_TOPIC",
      "CONFLICT_POSITION",
    ]),
  };
  const interestScore = {
    label: "관심도",
    me: findByRole(qualitative.interestInsights, meRole)?.score ?? 0,
    partner: findByRole(qualitative.interestInsights, partnerRole)?.score ?? 0,
  };
  const secondScore = coupleDaily
    ? { label: "애정지수", me: coupleDaily.affection.me.score, partner: coupleDaily.affection.partner.score }
    : {
        label: "표독력",
        me: findByRole(qualitative.spicinessInsights, meRole)?.score ?? 0,
        partner: findByRole(qualitative.spicinessInsights, partnerRole)?.score ?? 0,
      };
  // 연인·일상은 관심도의 칩 묶음을 "애정 표현"으로 보여줌
  const withAffectionChips = (interest, key) =>
    coupleDaily
      ? {
          ...interest,
          chips: {
            title: "애정 표현",
            caption: "대화에서 직접 확인되는 표현만 모았어요.",
            items: coupleDaily.affectionChips[key].items,
            summary: interest.chips.summary ?? coupleDaily.affectionChips[key].summary,
          },
        }
      : interest;

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
      me: withAffectionChips(toInterest(meRole, partnerRole, qualitative), "me"),
      partner: withAffectionChips(toInterest(partnerRole, meRole, qualitative), "partner"),
    },
    expression: {
      me: toExpression(meRole, qualitative),
      partner: toExpression(partnerRole, qualitative),
    },
    tf: {
      me: toTf(meRole, qualitative),
      partner: toTf(partnerRole, qualitative),
    },
    conflict,
    affection: coupleDaily?.affection ?? null,
    parentConflict,
  };
};
