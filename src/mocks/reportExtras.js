// 개발용: analysis-report-v10에 추가된 qualitativeAnalysis 필드 목데이터 (/report/mock* 에서 사용)
// reportMetrics · speakerTendencies · coachingSuggestions · representativeEvidences · relationshipSummary

const metric = (speakerRole, type, unit, value, title, description = "") => ({
  type,
  speakerRole,
  value,
  unit,
  title,
  description,
});

const evidence = (type, speakerRole, displayContent, reactionCategory = null) => ({
  type,
  speakerRole,
  reactionCategory,
  evidence: {
    segmentId: 0,
    speakerRole,
    originalContent: displayContent,
    displayContent,
    correctionApplied: false,
    startMs: 0,
    endMs: 0,
  },
});

const dailyCounts = (role, values) =>
  [
    ["COMPLIMENT", "칭찬"],
    ["ENCOURAGEMENT", "응원"],
    ["CARING_EXPRESSION", "챙기는 말"],
    ["FRIENDLY_ADDRESS", "친근한 호칭"],
    ["DIRECT_AFFECTION", "직접적인 호감 표현"],
    ["JOY_OR_GRATITUDE", "기쁨·고마움"],
  ]
    .map(([type, title], index) => values[index] != null && metric(role, type, "COUNT", values[index], title))
    .filter(Boolean);

const reactionEvidences = [
  evidence("REACTION_STYLE_EXAMPLE", "SELF", "지정 연기는 미리 알려줘요?", "THINKING"),
  evidence("REACTION_STYLE_EXAMPLE", "SELF", "으응 배고팠구나~", "FEELING"),
  evidence("REACTION_STYLE_EXAMPLE", "PARTNER", "아니 그거 진짜 힘들었을 것 같아", "FEELING"),
  evidence("REACTION_STYLE_EXAMPLE", "PARTNER", "그건 니 생각이고.", "THINKING"),
];

const MOCK_EXTRAS = {
  FRIEND_DAILY: {
    reportMetrics: [...dailyCounts("SELF", [5, 6, 8, 7, 3, 4]), ...dailyCounts("PARTNER", [2, 4, 3, 1, 0, 2])],
    representativeEvidences: reactionEvidences,
  },

  COUPLE_DAILY: {
    reportMetrics: [
      ...dailyCounts("SELF", [5, 6, 8, null, 3, 4]),
      ...dailyCounts("PARTNER", [2, 4, 3, null, 1, 2]),
      metric("SELF", "DIRECT_AFFECTION", "PERCENT", 74, "직접 표현", "좋아함과 보고 싶음을 직접 말한 정도"),
      metric("SELF", "CARING_EXPRESSION", "PERCENT", 86, "챙기는 말", "식사와 컨디션 등을 챙긴 정도"),
      metric("SELF", "COMPLIMENT_OR_ENCOURAGEMENT", "PERCENT", 70, "칭찬·응원", "상대의 노력과 일상을 긍정한 정도"),
      metric("SELF", "AFFECTIONATE_ADDRESS", "PERCENT", 65, "다정한 호칭", "애칭이나 부드러운 호칭을 쓴 정도"),
      metric("PARTNER", "DIRECT_AFFECTION", "PERCENT", 48, "직접 표현", "좋아함과 보고 싶음을 직접 말한 정도"),
      metric("PARTNER", "CARING_EXPRESSION", "PERCENT", 55, "챙기는 말", "식사와 컨디션 등을 챙긴 정도"),
      metric("PARTNER", "COMPLIMENT_OR_ENCOURAGEMENT", "PERCENT", 78, "칭찬·응원", "상대의 노력과 일상을 긍정한 정도"),
      metric("PARTNER", "AFFECTIONATE_ADDRESS", "PERCENT", 40, "다정한 호칭", "애칭이나 부드러운 호칭을 쓴 정도"),
    ],
    representativeEvidences: reactionEvidences,
  },

  COUPLE_CONFLICT: {
    reportMetrics: [
      metric("SELF", "POSITION_EXPLANATION", "COUNT", 18, "입장 설명", "자신이 그렇게 행동한 이유를 반복해 설명했어요."),
      metric("SELF", "REBUTTAL", "COUNT", 12, "반박 표현", "상대의 해석을 즉시 수정하는 표현이 있었어요."),
      metric("SELF", "AVOIDANCE", "COUNT", 6, "대화 피하기", "주제를 미루거나 대답을 짧게 끝낸 순간이 있었어요."),
      metric("SELF", "APOLOGY", "COUNT", 3, "사과 표현", "상대가 느낀 불편함을 인정하는 표현이 있었어요."),
      metric("SELF", "YIELDING", "COUNT", 4, "양보 표현", "다음에는 방식을 바꾸겠다는 제안이 나왔어요."),
      metric("SELF", "EMOTION_CHECK", "COUNT", 2, "감정 확인", "상대의 기분을 직접 물어봤어요."),
      metric("SELF", "QUESTION", "COUNT", 5, "질문"),
      metric("SELF", "MISSED_RESPONSE", "COUNT", 3, "미응답"),
      metric("SELF", "DIRECT_EXPRESSION", "PERCENT", 72, "직설 표현", "의견을 단도직입적으로 전달한 정도"),
      metric("SELF", "ASSERTIVE_EXPRESSION", "PERCENT", 64, "단정 표현", "상대의 의도를 확정해 말한 정도"),
      metric("SELF", "SOFTENING_EXPRESSION", "PERCENT", 38, "완충 표현", "어조를 부드럽게 만든 정도"),
      metric("SELF", "RECOVERY_EXPRESSION", "PERCENT", 55, "회복 표현", "미안함이나 이해를 드러낸 정도"),
      metric("PARTNER", "EMOTION_CHECK", "COUNT", 7, "감정 확인", "상대가 내 마음을 알고 있는지 여러 번 물었어요."),
      metric("PARTNER", "REBUTTAL", "COUNT", 4, "반박 표현", "상대의 설명에 바로 반박했어요."),
      metric("PARTNER", "APOLOGY", "COUNT", 1, "사과 표현", "자신의 말투에 대해 사과했어요."),
      metric("PARTNER", "QUESTION", "COUNT", 9, "질문"),
      metric("PARTNER", "MISSED_RESPONSE", "COUNT", 1, "미응답"),
      metric("PARTNER", "DIRECT_EXPRESSION", "PERCENT", 58, "직설 표현", "의견을 단도직입적으로 전달한 정도"),
      metric("PARTNER", "ASSERTIVE_EXPRESSION", "PERCENT", 42, "단정 표현", "상대의 의도를 확정해 말한 정도"),
      metric("PARTNER", "SOFTENING_EXPRESSION", "PERCENT", 51, "완충 표현", "어조를 부드럽게 만든 정도"),
      metric("PARTNER", "RECOVERY_EXPRESSION", "PERCENT", 62, "회복 표현", "미안함이나 이해를 드러낸 정도"),
    ],
    speakerTendencies: [
      { speakerRole: "SELF", label: "설명 중심", description: "감정을 확인하기보다 상황과 이유를 먼저 설명하는 편이에요." },
      { speakerRole: "PARTNER", label: "확인 중심", description: "이유를 듣기 전에 서운했던 마음을 알아주길 바랐어요." },
    ],
    coachingSuggestions: [
      { order: 1, title: "먼저 확인하기", description: "", suggestedPhrase: "그때 기다리면서 많이 서운했지?" },
      { order: 2, title: "이유는 그다음", description: "", suggestedPhrase: "그날 늦었던 이유를 말해도 될까?" },
      { order: 3, title: "다음 행동 정하기", description: "", suggestedPhrase: "다음엔 늦어지면 먼저 연락할게." },
    ],
    representativeEvidences: [
      evidence("EMOTION_EXPRESSION", "PARTNER", "기다리면서 좀 서운했어."),
      evidence("MISSED_QUESTION", "PARTNER", "내가 왜 화났는지 알겠어?"),
      evidence("FOLLOWING_RESPONSE", "SELF", "그때는 어쩔 수 없었다니까."),
      evidence("SPEAKER_REACTION", "SELF", "일단 내 얘기를 들어봐."),
      evidence("SPEAKER_REACTION", "PARTNER", "내 마음을 먼저 알아줬으면 해."),
      evidence("RECOVERY_START", "SELF", "그렇게 느낀 건 이해해."),
    ],
    relationshipSummary: { title: "설명하는 사람 × 확인받고 싶은 사람", description: "서로 원하는 반응의 순서가 달랐어요." },
  },

  PARENT_CHILD_CONFLICT: {
    reportMetrics: [
      metric("SELF", "SHORT_RESPONSE", "COUNT", 8, "짧은 대답"),
      metric("SELF", "TOPIC_AVOIDANCE", "COUNT", 5, "주제 피하기"),
      metric("SELF", "REBUTTAL", "COUNT", 7, "반박"),
      metric("SELF", "EMOTION_EXPRESSION", "COUNT", 4, "감정 표현"),
      metric("SELF", "APOLOGY", "COUNT", 2, "사과"),
      metric("SELF", "CHILD_EXPRESSION", "COUNT", 6, "자녀의 입장 표현"),
      metric("SELF", "SITUATION_QUESTION", "COUNT", 2, "상황 확인 질문", "부모의 걱정이 무엇인지 되물었어요."),
      metric("SELF", "ADVICE", "PERCENT", 20, "조언 표현", "문제 해결 방법을 직접 제시한 정도"),
      metric("SELF", "ASSERTIVE_EXPRESSION", "PERCENT", 62, "단정 표현", "상대의 선택이나 미래를 확정한 정도"),
      metric("SELF", "EMOTION_CHECK", "PERCENT", 48, "감정 확인", "기분과 마음을 물어본 정도"),
      metric("SELF", "SOFTENING_EXPRESSION", "PERCENT", 39, "완충 표현", "조언을 부드럽게 제안한 정도"),
      metric("PARTNER", "SITUATION_QUESTION", "COUNT", 14, "상황 확인 질문", "현재 상황과 계획에 대한 질문이 여러 번 이어졌어요."),
      metric("PARTNER", "CONCRETE_ADVICE", "COUNT", 21, "구체적인 조언", "행동 방향과 방법을 제시하는 표현이 많았어요."),
      metric("PARTNER", "EMOTION_CHECK", "COUNT", 3, "감정 확인 질문", "기분을 직접 물어보는 질문은 상대적으로 적었어요."),
      metric("PARTNER", "ASSERTIVE_EXPRESSION", "COUNT", 11, "단정 표현", "상대의 미래를 확정해 말하는 구간이 있었어요."),
      metric("PARTNER", "EXPERIENCE_COMPARISON", "COUNT", 8, "경험 비교", "과거 자신의 경험을 근거로 설득하려 했어요."),
      metric("PARTNER", "PARENT_CONFIRMATION", "COUNT", 3, "부모의 확인 반응"),
      metric("PARTNER", "ADVICE", "PERCENT", 84, "조언 표현", "문제 해결 방법을 직접 제시한 정도"),
      metric("PARTNER", "ASSERTIVE_EXPRESSION", "PERCENT", 75, "단정 표현", "상대의 선택이나 미래를 확정한 정도"),
      metric("PARTNER", "EMOTION_CHECK", "PERCENT", 24, "감정 확인", "기분과 마음을 물어본 정도"),
      metric("PARTNER", "SOFTENING_EXPRESSION", "PERCENT", 30, "완충 표현", "조언을 부드럽게 제안한 정도"),
    ],
    speakerTendencies: [
      { speakerRole: "SELF", label: "입장 설명", description: "자신이 직접 해보고 싶은 이유를 이해받고 싶어했어요." },
      { speakerRole: "PARTNER", label: "조언 중심", description: "걱정되는 마음에 질문보다 조언을 먼저 건넸어요." },
    ],
    coachingSuggestions: [
      { order: 1, title: "감정 먼저 묻기", description: "", suggestedPhrase: "그때 어떤 점이 답답했니?" },
      { order: 2, title: "조언은 허락받고", description: "", suggestedPhrase: "내 생각을 말해봐도 괜찮을까?" },
      { order: 3, title: "함께 선택하기", description: "", suggestedPhrase: "어떤 도움을 받으면 좋겠어?" },
    ],
    representativeEvidences: [
      evidence("CHILD_POSITION", "SELF", "일단은 제가 직접 해보고 싶어요."),
      evidence("FOLLOWING_ADVICE", "PARTNER", "그렇게 하면 나중에 후회할 수도 있어."),
      evidence("UNASKED_QUESTION", "SELF", "어떤 부분이 제일 걱정되세요?"),
      evidence("WORRY_START", "PARTNER", "앞으로 어떻게 할 생각이니?"),
      evidence("EXPRESSION_TURNING_POINT", "PARTNER", "내 말대로 하는 게 좋을 거야."),
      evidence("CLOSING_RESPONSE", "SELF", "알겠어요. 더 말 안 할게요."),
    ],
    relationshipSummary: {
      title: "걱정을 설명하는 부모 × 대안을 제안하는 자녀",
      description: "걱정과 자율성 사이에서 서로 지킬 수 있는 방법을 조율해요.",
    },
  },
};

export const buildMockReportExtras = (scenario) => MOCK_EXTRAS[scenario] ?? {};
