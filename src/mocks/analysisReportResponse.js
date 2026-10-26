// GET /api/v1/analyses/{recordingId} 응답(result) 모양의 임시 데이터 — 개발 중 /report/mock 에서 사용
export const mockAnalysisReportResponse = {
  recordingId: 0,
  status: "COMPLETED",
  failureReason: null,
  report: {
    recordingInfo: {
      recordingId: 0,
      scenario: "FRIEND_DAILY",
      durationMs: 1721000,
      speakers: [
        { speakerRole: "SELF", speakerName: "오늘따라왠지" },
        { speakerRole: "PARTNER", speakerName: "일곱글자닉네임" },
      ],
    },
    quantitativeAnalysis: {
      speakers: [
        {
          speakerRole: "SELF",
          speakingDurationMs: 1100000,
          utteranceCount: 96,
          speakingRatioPercent: 72,
          averageUtteranceDurationMs: 14200,
          syllablesPerSecond: 5.6,
        },
        {
          speakerRole: "PARTNER",
          speakingDurationMs: 430000,
          utteranceCount: 86,
          speakingRatioPercent: 28,
          averageUtteranceDurationMs: 5600,
          syllablesPerSecond: 5.0,
        },
      ],
      speakingSpeedComparison: { fasterSpeakerRole: "SELF", slowerSpeakerRole: "PARTNER", percentDifference: 12 },
    },
    qualitativeAnalysis: {
      overview: {
        title: "설명하는 사람 x 받아주는 사람",
        description: "오랫동안 오늘따라왠지님이 말하면 일곱글자닉네임님이 엄청난 리액션으로 받아줘요.",
      },
      timeline: [
        { title: "근황 공유", description: "학교와 알바 얘기로 가볍게 대화를 시작했어요.", startMs: 690000, endMs: 930000 },
        { title: "공통 관심사", description: "여행과 공연 이야기가 이어지며 서로 질문이 많아졌어요.", startMs: 930000, endMs: 1290000 },
        { title: "다음 약속", description: "다음 주 만날 장소를 정하며 자연스럽게 마무리했어요.", startMs: 1410000, endMs: 1721000 },
      ],
      topics: [
        { title: "여행 계획", description: "서로 경험을 덧붙이며 이야기해 주제가 끊기지 않고 이어졌어요.", turnCount: 82, speakingDurationMs: 492000, longest: true },
        { title: "공연", description: "", turnCount: 40, speakingDurationMs: 300000, longest: false },
        { title: "근황 공유", description: "", turnCount: 36, speakingDurationMs: 240000, longest: false },
        { title: "취업", description: "", turnCount: 2, speakingDurationMs: 30000, longest: false },
      ],
      characterInsights: [
        { speakerRole: "SELF", name: "설명 보부상", description: "자신의 관심분야를 설명하는걸 좋아해요" },
        { speakerRole: "PARTNER", name: "슈퍼에겐 아줌마", description: "상대방의 감정에 집중하고 리액션이 많아요" },
      ],
      speakerInsights: [
        {
          speakerRole: "SELF",
          patterns: [
            { category: "SHORT_RESPONSE", title: "짧게 받아주기", description: "짧은 말로 상대의 발화를 끊지 않고 이어줬어요.", count: 31 },
            { category: "REPEAT_OR_CONFIRM", title: "상대 말 반복하기", description: "상대의 말을 다시 짚어주며 듣고 있음을 보여줬어요.", count: 12 },
            { category: "FOLLOW_UP_QUESTION", title: "이어묻기", description: "상대의 다음 이야기가 이어지도록 자연스럽게 물었어요.", count: 21 },
            { category: "EMOTION_QUESTION", title: "감정묻기", description: "상대가 그때 어떻게 느꼈는지 직접 물었어요.", count: 8 },
          ],
          frequentExpressionSummary: { title: "획일화된 표현을 사용해요", description: "약간, 진짜와 같이 한개의 표현만 반복해서 사용하는 경향이 있어요." },
          frequentExpressions: [
            { category: "SPEECH_HABIT", expression: "약간", count: 12 },
            { category: "SPEECH_HABIT", expression: "근데", count: 7 },
            { category: "EMPHASIS", expression: "진짜", count: 10 },
            { category: "WORD", expression: "치킨", count: 8 },
          ],
        },
        {
          speakerRole: "PARTNER",
          patterns: [
            { category: "SHORT_RESPONSE", title: "짧게 받아주기", description: "짧은 말로 상대의 발화를 끊지 않고 이어줬어요.", count: 18 },
            { category: "FOLLOW_UP_QUESTION", title: "이어묻기", description: "상대의 다음 이야기가 이어지도록 자연스럽게 물었어요.", count: 4 },
          ],
          frequentExpressionSummary: { title: "감탄 표현이 많아요", description: "대박, 완전처럼 상대의 말에 크게 반응하는 표현을 자주 써요." },
          frequentExpressions: [
            { category: "EMPHASIS", expression: "대박", count: 9 },
            { category: "WORD", expression: "여행", count: 4 },
          ],
        },
      ],
      interestInsights: [
        {
          speakerRole: "SELF",
          score: 87,
          description: "대화비중이 높지 않지만 상대보다 3.2배 많이 질문했어요.",
          observations: [
            { category: "BACKCHANNEL", title: "주로 상대의 말을 반복해요", description: "상대가 잘 듣고 있다고 느낄 수 있지만, 부담스럽게 느껴질 수도 있어요." },
            { category: "QUESTION", title: "상대의 감정을 고려해요", description: "상대가 겪은 일을 말하면 감정을 자주 물어봐요." },
            { category: "AFFECTION_EXPRESSION", title: "칭찬을 자주 해요", description: "상대의 이야기에 칭찬과 응원을 자주 건네요." },
          ],
        },
        {
          speakerRole: "PARTNER",
          score: 21,
          description: "질문은 적지만 상대의 말에 빠르게 반응하며 대화를 이어가요.",
          observations: [
            { category: "BACKCHANNEL", title: "짧고 빠르게 반응해요", description: "상대의 이야기에 짧은 감탄으로 바로 반응해요." },
          ],
        },
      ],
      spicinessInsights: [
        {
          speakerRole: "SELF",
          score: 87,
          swearWordCount: 5,
          description: "비속어는 많지 않지만 생각을 돌려 말하지 않고 그대로 표현해요.",
          observations: [
            { category: "SWEAR_WORD", title: "비속어", description: "가끔 가벼운 비속어를 섞어 말해요." },
            { category: "DIRECTNESS", title: "직설력", description: "의견을 돌려 말하지 않는 편이에요." },
            { category: "PLAYFUL_CONTEXT", title: "장난 맥락", description: "직설적인 농담과 평가가 섞여 있어요." },
          ],
        },
        {
          speakerRole: "PARTNER",
          score: 21,
          swearWordCount: 0,
          description: "강한 표현은 적고, 말끝을 부드럽게 흐리는 경우가 많아요.",
          observations: [
            { category: "SOFTENING_EXPRESSION", title: "완충 표현", description: "말의 강도를 낮추는 표현을 자주 써요." },
          ],
        },
      ],
      reactionStyleInsights: [
        {
          speakerRole: "SELF",
          thinkingPercent: 87,
          feelingPercent: 13,
          description: "",
          examples: [
            { category: "THINKING", title: "지정 연기는 미리 알려줘요?", description: "" },
            { category: "FEELING", title: "으응 배고팠구나~", description: "" },
          ],
        },
        {
          speakerRole: "PARTNER",
          thinkingPercent: 29,
          feelingPercent: 71,
          description: "",
          examples: [
            { category: "FEELING", title: "아니 그거 진짜 힘들었을것 같아", description: "" },
            { category: "THINKING", title: "그건 니생각이고.", description: "" },
          ],
        },
      ],
      scenarioInsights: [],
    },
  },
};
