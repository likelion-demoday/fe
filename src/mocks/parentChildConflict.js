// TODO: 부모·자녀 갈등 전용 탭(질문·조언·갈등 표현·다시 대화)은 API에 대응 데이터가 없어 임시 데이터 사용
// 나(me) 쪽은 Figma 시안 문구 그대로, 상대(partner) 쪽은 임의 문구
export const buildParentChildConflictMock = () => ({
  overviewScores: [
    { label: "단정 표현", me: 62, partner: 75 },
    { label: "감정 확인", me: 48, partner: 24 },
  ],

  questionAdvice: {
    me: {
      score: 48,
      summary: {
        title: "서로 다른 답을 기다렸어요",
        description: "엄마는 해결 방법을, 지민은 자신의 입장을 이해받고 싶어했어요.",
      },
      groups: [
        {
          title: "질문 · 조언",
          items: [
            {
              title: "상황 확인 질문",
              count: 14,
              description: "현재 상황과 계획에 대한 질문이 여러 번 이어졌어요.",
              examples: ["응", "맞아", "아 진짜?"],
            },
            {
              title: "구체적인 조언",
              count: 21,
              description: "행동 방향과 방법을 제시하는 표현이 많았어요.",
              examples: ["그때는 그랬구나", "진짜 그렇게 생각해?", "어떻게 할 생각이야?"],
            },
            {
              title: "감정 확인 질문",
              count: 3,
              description: "기분을 직접 물어보는 질문은 상대적으로 적었어요.",
              examples: ["응 그렇긴 하네", "맞아"],
            },
          ],
          summary: {
            title: "질문이 조언으로 이어졌어요",
            description: "상황을 묻는 질문 뒤에 해결 방법을 바로 제시했어요.",
          },
        },
        {
          title: "훈계로 바뀐 순간",
          items: [
            {
              title: "단정 표현",
              count: 11,
              description: "상대의 미래를 확정해 말하는 구간이 있었어요.",
              examples: ["오 그래서?", "그럼 어떡해?", "아 진짜?"],
            },
            {
              title: "경험 비교",
              count: 8,
              description: "과거 자신의 경험을 근거로 설득하려 했어요.",
              examples: ["그때는 그랬구나", "진짜 그렇게 생각해?", "어떻게 할 생각이야?"],
            },
          ],
          summary: {
            title: "조언 뒤에 반박이 늘었어요",
            description: "한쪽의 제안이 길어질수록 다른 쪽은 더 짧게 반응했어요.",
          },
        },
      ],
      chips: {
        title: "대화가 닫히는 신호",
        caption: "대화에서 확인되는 표현만 정리했어요.",
        items: [
          { label: "짧은 대답", count: 8 },
          { label: "침묵", count: 3 },
          { label: "주제 피하기", count: 5 },
          { label: "반박", count: 7 },
          { label: "감정 표현", count: 4 },
          { label: "사과", count: 2 },
        ],
        summary: {
          title: "감정을 확인할 여지가 남았어요",
          description: "문제를 해결하기 전 서로 어떤 점이 답답했는지 더 들어볼 수 있어요.",
        },
      },
    },
    partner: {
      score: 64,
      summary: {
        title: "해결 방법을 먼저 찾았어요",
        description: "걱정되는 마음에 질문보다 조언을 먼저 건넸어요.",
      },
      groups: [
        {
          title: "질문 · 조언",
          items: [
            {
              title: "상황 확인 질문",
              count: 9,
              description: "앞으로의 계획을 구체적으로 물었어요.",
              examples: ["어떻게 할 거니?", "생각은 해봤어?"],
            },
            {
              title: "구체적인 조언",
              count: 17,
              description: "해야 할 일을 순서대로 제안했어요.",
              examples: ["이렇게 해봐", "미리 준비해야지"],
            },
          ],
          summary: {
            title: "조언이 질문보다 많았어요",
            description: "질문 하나에 여러 개의 제안이 이어졌어요.",
          },
        },
        {
          title: "훈계로 바뀐 순간",
          items: [
            {
              title: "경험 비교",
              count: 6,
              description: "엄마의 경험을 예로 들며 설득했어요.",
              examples: ["엄마 때는", "해보니까 알아"],
            },
          ],
          summary: {
            title: "걱정이 지시처럼 들렸어요",
            description: "응원하려는 말이 단정적인 표현으로 바뀌었어요.",
          },
        },
      ],
      chips: {
        title: "대화가 닫히는 신호",
        caption: "대화에서 확인되는 표현만 정리했어요.",
        items: [
          { label: "단정 표현", count: 9 },
          { label: "경험 비교", count: 6 },
          { label: "감정 확인", count: 2 },
          { label: "사과", count: 1 },
        ],
        summary: {
          title: "마음을 묻는 질문이 적었어요",
          description: "해결책보다 먼저 지민의 기분을 물어볼 수 있어요.",
        },
      },
    },
  },

  conflictExpression: {
    me: {
      score: 62,
      summary: {
        title: "조언과 단정이 겹친 구간이 있어요",
        description: "걱정하는 마음과 통제받는 느낌이 같은 표현에 섞였어요.",
      },
      axes: [
        { label: "조언 표현", value: 78, description: "문제 해결 방법을 직접 제시한 정도", examples: ["꼭", "왜", "네가"] },
        { label: "단정 표현", value: 71, description: "상대의 선택이나 미래를 확정한 표현", examples: ["꼭", "왜", "네가"] },
        { label: "감정 확인", value: 24, description: "기분과 마음을 물어본 표현의 비중", examples: ["꼭", "왜", "네가"] },
        { label: "완충 표현", value: 39, description: "조언을 부드럽게 제안하는 표현", examples: ["꼭", "왜", "네가"] },
      ],
      contexts: [
        { title: "의견 차이", description: "진로를 정하는 시점과 방식에서 견해가 갈렸어요." },
        { title: "걱정의 표현", description: "응원하려는 말이 지시처럼 들릴 수 있는 부분이 있어요." },
        { title: "대화의 끝", description: "서로의 감정을 충분히 확인하지 못한 채 마쳤어요." },
      ],
    },
    partner: {
      score: 75,
      summary: {
        title: "단정적인 표현이 많았어요",
        description: "걱정이 커질수록 확신에 찬 표현이 늘었어요.",
      },
      axes: [
        { label: "조언 표현", value: 84, description: "문제 해결 방법을 직접 제시한 정도", examples: ["해야지", "해봐"] },
        { label: "단정 표현", value: 75, description: "상대의 선택이나 미래를 확정한 표현", examples: ["분명", "무조건"] },
        { label: "감정 확인", value: 18, description: "기분과 마음을 물어본 표현의 비중", examples: ["괜찮아?"] },
        { label: "완충 표현", value: 30, description: "조언을 부드럽게 제안하는 표현", examples: ["혹시", "한번"] },
      ],
      contexts: [
        { title: "의견 차이", description: "지금 바로 정해야 한다는 입장을 여러 번 말했어요." },
        { title: "걱정의 표현", description: "실패할까 봐 걱정하는 마음이 조언으로 드러났어요." },
      ],
    },
  },

  retry: [
    {
      title: "놓친 말",
      scores: { me: "표현 6회", partner: "확인 3회" },
      quotes: {
        me: [
          { label: "자녀의 입장", text: "일단은 제가 직접 해보고 싶어요.", highlighted: true },
          { label: "이어진 조언", text: "그렇게 하면 나중에 후회할 수도 있어.", highlighted: true },
          { label: "미처 못한 질문", text: "어떤 부분이 제일 걱정되세요?" },
        ],
        partner: [
          { label: "부모의 걱정", text: "준비 없이 하면 힘들 수 있어.", highlighted: true },
          { label: "이어진 대답", text: "알아서 할게요.", highlighted: true },
          { label: "미처 못한 질문", text: "너는 어떻게 하고 싶은데?" },
        ],
      },
    },
    {
      title: "훈계로 바뀐 순간",
      scores: { me: "설명 중심", partner: "조언 중심" },
      quotes: {
        me: [
          { label: "걱정의 시작", text: "앞으로 어떻게 할 생각이니?", highlighted: true },
          { label: "표현이 바뀐 지점", text: "내 말대로 하는 게 좋을 거야.", highlighted: true },
          { label: "닫히는 대답", text: "알겠어요. 더 말 안 할게요." },
        ],
        partner: [
          { label: "걱정의 시작", text: "앞으로 어떻게 할 생각이니?", highlighted: true },
          { label: "표현이 바뀐 지점", text: "내 말대로 하는 게 좋을 거야.", highlighted: true },
          { label: "닫히는 대답", text: "알겠어요. 더 말 안 할게요." },
        ],
      },
    },
    {
      title: "다시 대화하기",
      scores: { me: "입장 설명", partner: "걱정 전달" },
      quotes: {
        me: [
          { label: "마음 먼저 말하기", text: "엄마가 걱정하는 건 알아요.", highlighted: true },
          { label: "이유 설명하기", text: "제가 해보고 싶은 이유를 들어주세요.", highlighted: true },
          { label: "함께 정하기", text: "어떻게 하면 엄마도 안심할까요?" },
        ],
        partner: [
          { label: "감정 먼저 묻기", text: "그때 어떤 점이 답답했니?", highlighted: true },
          { label: "조언은 허락받고", text: "내 생각을 말해봐도 괜찮을까?", highlighted: true },
          { label: "함께 선택하기", text: "어떤 도움을 받으면 좋겠어?" },
        ],
      },
    },
  ],
});
