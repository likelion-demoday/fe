// TODO: 연인·일상 전용 데이터(애정 표현 탭, 관심도의 애정 표현 칩)는 API에 대응 데이터가 없어 임시 데이터 사용
// 나(me) 쪽은 Figma 시안 문구 그대로, 상대(partner) 쪽은 임의 문구
export const buildCoupleDailyMock = () => ({
  affectionChips: {
    me: {
      items: [
        { label: "칭찬", count: 5 },
        { label: "응원", count: 6 },
        { label: "챙기는 말", count: 8 },
        { label: "다정한 호칭", count: 7 },
        { label: "보고 싶다는 말", count: 3 },
        { label: "고마움", count: 4 },
      ],
      summary: {
        title: "챙겨주는 말이 자주 등장해요",
        description: "안부를 묻고 식사를 챙기는 말에서 익숙한 다정함이 보였어요.",
      },
    },
    partner: {
      items: [
        { label: "칭찬", count: 2 },
        { label: "응원", count: 4 },
        { label: "챙기는 말", count: 3 },
        { label: "고마움", count: 2 },
      ],
      summary: {
        title: "응원하는 말이 많았어요",
        description: "상대의 하루를 들으며 짧은 응원으로 마음을 전했어요.",
      },
    },
  },

  affection: {
    me: {
      score: 74,
      summary: {
        title: "말로 애정을 표현하는 편이에요",
        description: "직접적인 애정 표현과 일상 속 챙김이 함께 나타났어요.",
      },
      axes: [
        {
          label: "직접 표현",
          value: 74,
          description: "좋아함과 보고 싶음을 직접 말하는 비중",
          examples: ["보고싶어", "좋아", "고마워"],
        },
        { label: "챙기는 말", value: 86, description: "식사와 컨디션 등을 챙기는 표현" },
        { label: "칭찬·응원", value: 70, description: "상대의 노력과 일상을 긍정하는 말" },
        { label: "다정한 호칭", value: 65, description: "애칭이나 부드러운 호칭을 사용하는 정도" },
      ],
      contexts: [
        { title: "애정 표현 타이밍", description: "대화가 끝날 때 다정한 말이 늘어났어요." },
        { title: "장난과 친밀감", description: "서로 놀리다가도 웃음과 애정을 덧붙였어요." },
        { title: "관심의 균형", description: "한쪽만 표현하지 않고 서로 반응을 주고받았어요." },
      ],
    },
    partner: {
      score: 68,
      summary: {
        title: "리액션으로 애정을 표현해요",
        description: "직접적인 말보다 짧은 반응과 응원으로 마음을 전했어요.",
      },
      axes: [
        {
          label: "직접 표현",
          value: 48,
          description: "좋아함과 보고 싶음을 직접 말하는 비중",
          examples: ["좋아", "고마워"],
        },
        { label: "챙기는 말", value: 55, description: "식사와 컨디션 등을 챙기는 표현" },
        { label: "칭찬·응원", value: 78, description: "상대의 노력과 일상을 긍정하는 말" },
        { label: "다정한 호칭", value: 40, description: "애칭이나 부드러운 호칭을 사용하는 정도" },
      ],
      contexts: [
        { title: "애정 표현 타이밍", description: "상대의 이야기에 바로 반응하며 다정함을 보였어요." },
        { title: "관심의 균형", description: "한쪽만 표현하지 않고 서로 반응을 주고받았어요." },
      ],
    },
  },
});
