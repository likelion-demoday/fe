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
};
