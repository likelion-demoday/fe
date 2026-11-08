// 같은 브라우저에서 소개를 완료하거나 건너뛰면 다시 표시하지 않습니다.
const INTRODUCTION_KEY = "resay:introduction:complete";

export const needsIntroduction = () =>
  localStorage.getItem(INTRODUCTION_KEY) !== "true";

export const completeIntroduction = () =>
  localStorage.setItem(INTRODUCTION_KEY, "true");
