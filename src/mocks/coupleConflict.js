// TODO: 연인·갈등 전용 탭(갈등 반응·표현 강도·놓친 말·애착 유형)은 API에 대응 데이터가 없어 임시 데이터 사용
// 나(me) 쪽은 Figma 시안 문구 그대로, 상대(partner) 쪽은 임의 문구
export const buildCoupleConflictMock = (meName, partnerName) => ({
  overviewScores: [
    { label: "직설 표현", me: 72, partner: 58 },
    { label: "회복 시도", me: 55, partner: 62 },
  ],

  reaction: {
    me: {
      score: 68,
      summary: {
        title: "갈등 중 반응이 서로 달랐어요",
        description: "한쪽은 설명을 이어가고 다른 쪽은 감정 확인을 원했어요.",
      },
      groups: [
        {
          title: "방어 · 회피",
          items: [
            {
              title: "입장 설명",
              count: 18,
              description: "자신이 그렇게 행동한 이유를 반복해 설명했어요.",
              examples: ["응", "맞아", "아 진짜?"],
            },
            {
              title: "반박 표현",
              count: 12,
              description: "상대의 해석을 즉시 수정하는 표현이 있었어요.",
              examples: ["왜 그렇게 생각해?", "그게 내 잘못이야?", "좀 들어봐"],
            },
            {
              title: "대화 피하기",
              count: 6,
              description: "주제를 미루거나 대답을 짧게 끝낸 순간이 있었어요.",
              examples: ["응 그렇긴 하네", "맞아"],
            },
          ],
          summary: {
            title: "입장 설명이 길어졌어요",
            description: "설명은 많았지만 상대의 감정을 묻는 말은 적었어요.",
          },
        },
        {
          title: "관계 회복",
          items: [
            {
              title: "사과 표현",
              count: 3,
              description: "상대가 느낀 불편함을 인정하는 표현이 있었어요.",
              examples: ["오 그래서?", "그럼 어떡해?", "아 진짜?"],
            },
            {
              title: "양보 표현",
              count: 4,
              description: "다음에는 방식을 바꾸겠다는 제안이 나왔어요.",
              examples: ["왜 그렇게 생각해?", "그게 내 잘못이야?", "좀 들어봐"],
            },
          ],
          summary: {
            title: "대화 후반에 진정했어요",
            description: "말의 강도는 낮아졌지만 남은 감정은 더 확인할 필요가 있어요.",
          },
        },
      ],
      chips: {
        title: "회복 시도",
        caption: "직접 말로 드러난 변화만 모았어요.",
        items: [
          { label: "사과", count: 3 },
          { label: "양보", count: 4 },
          { label: "감정 확인", count: 2 },
          { label: "완충 표현", count: 5 },
          { label: "재설명", count: 8 },
          { label: "다음 약속", count: 2 },
        ],
        summary: {
          title: "사과 뒤 행동 제안이 이어졌어요",
          description: "대화를 끝낼 때 다음 만남의 방식을 함께 정했어요.",
        },
      },
    },
    partner: {
      score: 51,
      summary: {
        title: "감정을 먼저 확인하고 싶어 했어요",
        description: "이유를 듣기 전에 서운했던 마음을 알아주길 바랐어요.",
      },
      groups: [
        {
          title: "방어 · 회피",
          items: [
            {
              title: "감정 표현",
              count: 9,
              description: "서운했던 마음을 직접 말로 꺼냈어요.",
              examples: ["서운했어", "기다렸잖아"],
            },
            {
              title: "확인 질문",
              count: 7,
              description: "상대가 내 마음을 알고 있는지 여러 번 물었어요.",
              examples: ["알겠어?", "내 말 듣고 있어?"],
            },
          ],
          summary: {
            title: "확인 질문이 반복됐어요",
            description: "답을 듣기 전에 같은 질문을 다시 꺼낸 순간이 있었어요.",
          },
        },
        {
          title: "관계 회복",
          items: [
            {
              title: "수용 표현",
              count: 4,
              description: "상대의 설명을 받아들이는 말이 나왔어요.",
              examples: ["그랬구나", "알겠어"],
            },
          ],
          summary: {
            title: "설명을 들은 뒤 누그러졌어요",
            description: "상대의 사과 이후 말의 강도가 낮아졌어요.",
          },
        },
      ],
      chips: {
        title: "회복 시도",
        caption: "직접 말로 드러난 변화만 모았어요.",
        items: [
          { label: "사과", count: 1 },
          { label: "양보", count: 2 },
          { label: "감정 확인", count: 7 },
          { label: "완충 표현", count: 3 },
        ],
        summary: {
          title: "다음 약속에 동의했어요",
          description: "늦어지면 먼저 연락하자는 제안을 받아들였어요.",
        },
      },
    },
  },

  intensity: {
    me: {
      score: 72,
      summary: {
        title: "서로의 말이 강해진 순간이 있어요",
        description: "직설적 표현 뒤에 완충과 수습의 표현도 나타났어요.",
      },
      axes: [
        { label: "직설 표현", value: 72, description: "의견을 단도직입적으로 전달한 정도", examples: ["항상", "왜", "그만"] },
        { label: "단정 표현", value: 64, description: "상대의 의도를 확정해 말한 표현", examples: ["꼭", "왜", "네가"] },
        { label: "완충 표현", value: 38, description: "어조를 부드럽게 만드는 말의 비중", examples: ["꼭", "왜", "네가"] },
        { label: "회복 표현", value: 55, description: "미안함이나 이해를 드러내는 표현", examples: ["꼭", "왜", "네가"] },
      ],
      contexts: [
        { title: "서운함의 대상", description: "행동 자체보다 약속을 대하는 태도를 문제 삼았어요." },
        { title: "장난에서 갈등으로", description: "가벼운 농담이 반박으로 바뀌는 구간이 있었어요." },
        { title: "진정의 단서", description: "상대의 감정을 인정한 뒤 표현 강도가 낮아졌어요." },
      ],
    },
    partner: {
      score: 58,
      summary: {
        title: "감정이 담긴 말이 많았어요",
        description: "직설적인 표현보다 서운함을 드러내는 말이 많았어요.",
      },
      axes: [
        { label: "직설 표현", value: 58, description: "의견을 단도직입적으로 전달한 정도", examples: ["진짜", "왜"] },
        { label: "단정 표현", value: 42, description: "상대의 의도를 확정해 말한 표현", examples: ["맨날", "또"] },
        { label: "완충 표현", value: 51, description: "어조를 부드럽게 만드는 말의 비중", examples: ["그냥", "조금"] },
        { label: "회복 표현", value: 62, description: "미안함이나 이해를 드러내는 표현", examples: ["알겠어", "그랬구나"] },
      ],
      contexts: [
        { title: "서운함의 대상", description: "늦은 것보다 연락이 없었던 점을 더 아쉬워했어요." },
        { title: "진정의 단서", description: "사과를 들은 뒤 확인 질문이 줄어들었어요." },
      ],
    },
  },

  missed: [
    {
      title: "놓친 말",
      scores: { me: "질문 5회", partner: "미응답 3회" },
      quotes: {
        me: [
          { label: "감정 표현", text: "기다리면서 좀 서운했어.", highlighted: true },
          { label: "놓친 질문", text: "내가 왜 화났는지 알겠어?", highlighted: true },
          { label: "이어진 반응", text: "그때는 어쩔 수 없었다니까." },
        ],
        partner: [
          { label: "감정 표현", text: "나도 늦고 싶어서 늦은 건 아니야.", highlighted: true },
          { label: "놓친 질문", text: "많이 기다렸어?", highlighted: true },
          { label: "이어진 반응", text: "그 얘기는 이제 그만하자." },
        ],
      },
    },
    {
      title: "갈등 반응 경향",
      scores: { me: "설명 중심", partner: "확인 중심" },
      quotes: {
        me: [
          { label: `${meName}의 반응`, text: "일단 내 얘기를 들어봐.", highlighted: true },
          { label: `${partnerName}의 반응`, text: "내 마음을 먼저 알아줬으면 해.", highlighted: true },
          { label: "회복의 시작", text: "그렇게 느낀 건 이해해." },
        ],
        partner: [
          { label: `${meName}의 반응`, text: "일단 내 얘기를 들어봐.", highlighted: true },
          { label: `${partnerName}의 반응`, text: "내 마음을 먼저 알아줬으면 해.", highlighted: true },
          { label: "회복의 시작", text: "그렇게 느낀 건 이해해." },
        ],
      },
    },
    {
      title: "대화 개선 힌트",
      scores: { me: "설명 먼저", partner: "공감 먼저" },
      quotes: {
        me: [
          { label: "먼저 확인하기", text: "그때 기다리면서 많이 서운했지?", highlighted: true },
          { label: "이유는 그다음", text: "그날 늦었던 이유를 말해도 될까?", highlighted: true },
          { label: "다음 행동 정하기", text: "다음엔 늦어지면 먼저 연락할게." },
        ],
        partner: [
          { label: "먼저 말하기", text: "나 그때 좀 서운했어.", highlighted: true },
          { label: "이유 들어보기", text: "무슨 일 있었는지 말해줄래?", highlighted: true },
          { label: "다음 행동 정하기", text: "다음엔 늦어지면 미리 알려줘." },
        ],
      },
    },
  ],

  attachment: {
    me: {
      score: 41,
      summary: {
        title: "두 사람의 반응 순서가 달랐어요",
        description: "대화 속 표현만 살펴본 예시이며, 애착 유형을 진단하는 결과는 아니에요.",
      },
      axes: [
        { label: "안정형", value: 48, description: "감정을 확인하며 대화를 이어가는 반응", examples: ["항상", "왜", "그만"] },
        { label: "회피형", value: 61, description: "대답을 줄이거나 대화를 미루는 반응", examples: ["꼭", "왜", "네가"] },
        { label: "불안형", value: 59, description: "안심이나 확인을 반복해서 요청하는 반응", examples: ["꼭", "왜", "네가"] },
        { label: "추격형", value: 44, description: "상대방의 응답을 계속 요청하는 반응", examples: ["꼭", "왜", "네가"] },
      ],
      contexts: [
        { title: "복합형 반응", description: "한 대화에서 여러 반응 유형이 함께 나타났어요." },
        { title: "멘헤라 지수", description: "예시 점수 36/100 · 의학적 또는 심리학적 척도가 아니에요." },
        { title: "해석 시 주의", description: "하나의 갈등 대화만으로 개인의 애착 유형을 확정할 수 없어요." },
      ],
    },
    partner: {
      score: 67,
      summary: {
        title: "확인을 원하는 반응이 많았어요",
        description: "대화 속 표현만 살펴본 예시이며, 애착 유형을 진단하는 결과는 아니에요.",
      },
      axes: [
        { label: "안정형", value: 52, description: "감정을 확인하며 대화를 이어가는 반응", examples: ["그랬구나", "알겠어"] },
        { label: "회피형", value: 28, description: "대답을 줄이거나 대화를 미루는 반응", examples: ["그만하자"] },
        { label: "불안형", value: 67, description: "안심이나 확인을 반복해서 요청하는 반응", examples: ["알겠어?", "진짜?"] },
        { label: "추격형", value: 63, description: "상대방의 응답을 계속 요청하는 반응", examples: ["대답해", "왜 말이 없어"] },
      ],
      contexts: [
        { title: "복합형 반응", description: "불안형과 추격형 반응이 함께 나타났어요." },
        { title: "멘헤라 지수", description: "예시 점수 58/100 · 의학적 또는 심리학적 척도가 아니에요." },
        { title: "해석 시 주의", description: "하나의 갈등 대화만으로 개인의 애착 유형을 확정할 수 없어요." },
      ],
    },
  },
});
