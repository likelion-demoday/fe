// 진행 중인 분석(결제 후 ~ 완료/실패 전) 정보. 로딩 화면을 나가도 홈에서 이어갈 수 있게 저장
// value: 분석 화면 사이에서 넘기던 navigate state (recordingId, type, relation)
const PENDING_ANALYSIS_KEY = "pendingAnalysis";

export const savePendingAnalysis = ({ recordingId, type, relation }) => {
  localStorage.setItem(PENDING_ANALYSIS_KEY, JSON.stringify({ recordingId, type, relation }));
};

export const getPendingAnalysis = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_ANALYSIS_KEY));
  } catch {
    return null;
  }
};

export const clearPendingAnalysis = () => {
  localStorage.removeItem(PENDING_ANALYSIS_KEY);
};
