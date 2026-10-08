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
};
