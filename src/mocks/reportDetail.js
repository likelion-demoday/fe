import explainerImage from "../assets/images/character-explainer.png";
import superEgenImage from "../assets/images/character-super-egen.png";

// TODO: 리포트 API(src/api/report.js) 연동 전 임시 데이터 (디자인 값 기준)
export const mockReportDetail = {
  date: "9월 21일",
  duration: "28분 41초",
  type: "일상 중심",
  relation: "친구 사이",
  speakers: {
    me: {
      nickname: "오늘따라왠지",
      character: {
        name: "설명 보부상",
        description: ["자신의 관심분야를", "설명하는걸 좋아해요"],
        titleColor: "#3d465d",
        background: "linear-gradient(146.42deg, #fff 40.138%, #c2c5d9 89.392%)",
        image: explainerImage,
        imageBox: "top-[44.1px] left-[15.56px] size-[156.515px]",
        shadowBox: "top-[171.33px] left-[59.5px] h-[12.814px] w-[68.647px]",
      },
    },
    partner: {
      nickname: "일곱글자닉네임",
      character: {
        name: "슈퍼에겐 아줌마",
        description: ["상대방의 감정에 집중하고", "리액션이 많아요"],
        titleColor: "#c8b9cd",
        background: "linear-gradient(154.64deg, #fff 43.136%, #e2d6e6 87.54%)",
        image: superEgenImage,
        imageBox: "top-[42.81px] left-[39.16px] h-[156.089px] w-[124.916px]",
        shadowBox: "top-[172.94px] left-[44.1px] h-[12.995px] w-[69.614px]",
      },
    },
  },
  overview: {
    scores: [
      { label: "관심도", me: 91, partner: 91 },
      { label: "표독력", me: 91, partner: 91 },
    ],
    summary: {
      title: "설명하는 사람 x 받아주는 사람",
      description: "오랫동안 오늘따라왠지님이 말하면 일곱글자닉네임이 엄청난 리액션으로 받아줘요.",
    },
  },
  // keywords: 설명 문장 안에서 강조할 단어
  info: {
    commonInterests: ["여행", "공연", "취업"],
    longestTopic: {
      title: "여행 계획",
      duration: "8분 12초",
      description: "서로 경험을 덧붙이며 이야기해 주제가 끊기지 않고 이어졌어요.",
    },
    timeline: [
      { time: "11:30", title: "근황 공유", description: "학교와 알바 얘기로 가볍게 대화를 시작했어요.", keywords: ["학교", "알바"] },
      { time: "15:30", title: "공통 관심사", description: "여행과 공연 이야기가 이어지며 서로 질문이 많아졌어요.", keywords: ["여행", "공연"] },
      { time: "21:30", title: "반응 활발", description: "농담과 맞장구가 늘면서 발화 길이도 함께 길어졌어요.", keywords: [] },
      { time: "23:30", title: "다음 약속", description: "다음 주 만날 장소를 정하며 자연스럽게 마무리했어요.", keywords: ["다음 주 만날 장소"] },
    ],
    topicTurns: [
      { topic: "개그맨 데뷔 과정", turns: 82 },
      { topic: "활동과 코미디 회고", turns: 82 },
      { topic: "운동과 몸 이야기", turns: 2 },
      { topic: "근황 공유", turns: 36 },
    ],
    stats: { recordingTime: "28:41", turns: 182, topicCount: 4 },
  },
  // position: 막대가 채워지는 정도(0~100), range: 막대 양끝 라벨
  // "나(me)"는 디자인 값, "친구(partner)"는 화자 전환 확인용 임시 값
  style: {
    me: {
      rhythm: [
        { label: "발화 비중", value: "72%", position: 72, range: ["0%", "100%"] },
        { label: "평균 발화 길이", value: "14.2초", position: 64, range: ["짧음", "긺"] },
        { label: "평균 발화 속도", value: "+12%", position: 62, range: ["느림", "빠름"] },
      ],
      rhythmSummary: {
        title: "설명은 길고 말은 빨라요",
        description: "바보자쉭님보다 2.5배 이상으로 발화량이 많고 발화가 길어요.",
      },
      expressions: [
        { category: "필러 표현", items: [{ word: "약간", count: 12 }, { word: "근데", count: 7 }, { word: "아니", count: 2 }] },
        { category: "강조 표현", items: [{ word: "진짜", count: 10 }, { word: "완전", count: 5 }, { word: "너무", count: 3 }] },
        { category: "단어", items: [{ word: "민지", count: 21 }, { word: "치킨", count: 8 }, { word: "고양이", count: 3 }] },
      ],
      expressionSummary: {
        title: "획일화된 표현을 사용해요",
        description: "약간, 진짜와 같이 한개의 표현만 반복해서 사용하는 경향이 있어요.",
      },
    },
    partner: {
      rhythm: [
        { label: "발화 비중", value: "28%", position: 28, range: ["0%", "100%"] },
        { label: "평균 발화 길이", value: "5.6초", position: 30, range: ["짧음", "긺"] },
        { label: "평균 발화 속도", value: "-4%", position: 46, range: ["느림", "빠름"] },
      ],
      rhythmSummary: {
        title: "짧게 받아주며 들어줘요",
        description: "오늘따라왠지님의 이야기를 짧은 반응으로 받아주며 대화를 이어가요.",
      },
      expressions: [
        { category: "필러 표현", items: [{ word: "음", count: 6 }, { word: "그니까", count: 3 }] },
        { category: "강조 표현", items: [{ word: "대박", count: 9 }, { word: "완전", count: 4 }] },
        { category: "단어", items: [{ word: "치킨", count: 7 }, { word: "여행", count: 4 }] },
      ],
      expressionSummary: {
        title: "감탄 표현이 많아요",
        description: "대박, 완전처럼 상대의 말에 크게 반응하는 표현을 자주 써요.",
      },
    },
  },
  // examples: 실제로 한 말 예시 (첫 번째가 대표 예시)
  // "나(me)"는 디자인 값, "친구(partner)"는 화자 전환 확인용 임시 값
  interest: {
    me: {
      score: 87,
      summary: {
        title: "질문으로 상대에게 관심을 보여요",
        description: "대화비중이 높지 않지만 상대보다 3.2배 많이 질문했어요.",
      },
      groups: [
        {
          title: "맞장구 • 공감",
          items: [
            { title: "짧게 받아주기", count: 31, description: "짧은 말로 상대의 발화를 끊지 않고 이어줬어요.", examples: ["응", "맞아", "아 진짜?"] },
            { title: "상대 말 반복하기", count: 12, description: "상대의 말을 다시 짚어주며 듣고 있음을 보여줬어요.", examples: ["아 스타벅스 갔구나", "오 교수님이 불렀다고?", "아 햄버거 먹었구나"] },
            { title: "상황 이해 표현", count: 6, description: "상대의 상황을 이해한다는 뜻을 말로 표현했어요.", examples: ["응 그렇긴 하네", "맞아"] },
          ],
          summary: {
            title: "주로 바보자쉭님의 말을 반복해요",
            description: "바보자쉭님이 자신의 이야기를 잘 듣고 있다고 느낄 수 있지만, 부담스럽게 느껴질 수도 있어요.",
          },
        },
        {
          title: "질문",
          items: [
            { title: "이어묻기", count: 21, description: "상대의 다음 이야기가 이어지도록 자연스럽게 물었어요.", examples: ["오 그래서?", "그럼 어떡해?", "아 진짜?"] },
            { title: "감정묻기", count: 8, description: "상대가 그때 어떻게 느꼈는지 직접 물었어요.", examples: ["아 스타벅스 갔구나", "오 교수님이 불렀다고?", "아 햄버거 먹었구나"] },
          ],
          summary: {
            title: "바보자쉭님의 감정을 고려해요",
            description: "바보자쉭님이 겪은 일을 말하면 오늘따라왠지님은 감정을 자주 물어봐요.",
          },
        },
      ],
      affection: {
        items: [
          { label: "칭찬", count: 2 },
          { label: "응원", count: 2 },
          { label: "챙기는 말", count: 2 },
          { label: "친근한 호칭", count: 2 },
          { label: "직접적인 호감", count: 2 },
          { label: "반가움", count: 2 },
        ],
        summary: {
          title: "바보자쉭님의 감정을 고려해요",
          description: "바보자쉭님이 겪은 일을 말하면 오늘따라왠지님은 감정을 자주 물어봐요.",
        },
      },
    },
    partner: {
      score: 21,
      summary: {
        title: "짧은 맞장구로 관심을 보여요",
        description: "질문은 적지만 상대의 말에 빠르게 반응하며 대화를 이어가요.",
      },
      groups: [
        {
          title: "맞장구 • 공감",
          items: [
            { title: "짧게 받아주기", count: 18, description: "짧은 말로 상대의 발화를 끊지 않고 이어줬어요.", examples: ["헐", "대박", "그치"] },
          ],
          summary: {
            title: "짧고 빠르게 반응해요",
            description: "오늘따라왠지님의 이야기에 짧은 감탄으로 바로 반응해요.",
          },
        },
        {
          title: "질문",
          items: [
            { title: "이어묻기", count: 4, description: "상대의 다음 이야기가 이어지도록 자연스럽게 물었어요.", examples: ["그래서 어떻게 됐어?"] },
          ],
          summary: {
            title: "질문보다 반응이 많아요",
            description: "새로 묻기보다 상대의 이야기에 반응하는 쪽이 많아요.",
          },
        },
      ],
      affection: {
        items: [
          { label: "반가움", count: 3 },
          { label: "칭찬", count: 1 },
        ],
        summary: {
          title: "반가움을 자주 표현해요",
          description: "오늘따라왠지님의 이야기에 반가움을 드러내는 표현이 많아요.",
        },
      },
    },
  },
  // axes: 표현 지표(value·position 0~100), examples가 있으면 실제 쓴 단어 칩 표시
  // "나(me)"는 디자인 값, "친구(partner)"는 화자 전환 확인용 임시 값
  expression: {
    me: {
      score: 87,
      summary: {
        title: "욕은 적지만 필터링이 없는 편이에요",
        description: "비속어는 많지 않지만 생각을 돌려 말하지 않고 그대로 표현해요.",
      },
      axes: [
        { label: "비속어", value: 91, description: "비속어를 사용하는 정도", examples: ["씨*", "미친", "또라이"] },
        { label: "직설력", value: 88, description: "의견을 돌려말하지 않는 정도" },
        { label: "표현 강도", value: 80, description: "부정 평가를 할 때 강한 단어를 사용하는 정도" },
        { label: "완충 표현", value: 72, description: "말의 강도를 낮추는 말을 사용하는 정도" },
      ],
      contexts: [
        { title: "공격대상", description: "상대에게 직접적으로 하는 평가가 종종 보여요." },
        { title: "장난 맥락", description: "직설적인 농담과 평가가 섞여 있어요." },
        { title: "회복 표현", description: "세게 말한 뒤 의미를 다시 풀어줘요." },
      ],
    },
    partner: {
      score: 21,
      summary: {
        title: "부드럽게 말하는 편이에요",
        description: "강한 표현은 적고, 말끝을 부드럽게 흐리는 경우가 많아요.",
      },
      axes: [
        { label: "비속어", value: 12, description: "비속어를 사용하는 정도", examples: ["미친"] },
        { label: "직설력", value: 35, description: "의견을 돌려말하지 않는 정도" },
        { label: "표현 강도", value: 20, description: "부정 평가를 할 때 강한 단어를 사용하는 정도" },
        { label: "완충 표현", value: 81, description: "말의 강도를 낮추는 말을 사용하는 정도" },
      ],
      contexts: [
        { title: "장난 맥락", description: "강한 표현은 대부분 장난스러운 흐름에서 나왔어요." },
      ],
    },
  },
};
