// 분석 실패 사유(failureReason) → 사용자 안내 문구. 실패 시 크레딧은 서버에서 전액 환불
const FAILURE_REASON_MESSAGES = {
  TRANSCRIPTION_REQUEST_FAILED: "녹음 파일을 전송하지 못했어요.",
  TRANSCRIPTION_FAILED: "녹음 내용을 글로 옮기지 못했어요.",
  SPEAKER_NOT_SEPARATED: "두 사람의 목소리를 구분하지 못했어요.\n두 사람이 번갈아 말하는 대화로 다시 녹음해 주세요.",
  TRANSCRIPTION_TIMEOUT: "녹음 내용을 옮기는 데 시간이 너무 오래 걸렸어요.",
  SPEAKER_SELECTION_EXPIRED: "화자 선택 시간이 지났어요.",
  INSUFFICIENT_SPEAKER_DATA: "분석하기에 대화 내용이 부족해요.\n조금 더 길게 대화를 녹음해 주세요.",
  EXTERNAL_SERVICE_UNAVAILABLE: "분석 서비스에 일시적인 문제가 생겼어요.\n잠시 후 다시 시도해 주세요.",
  INVALID_ANALYSIS_RESPONSE: "분석 결과를 만들지 못했어요.",
  PROCESSING_ERROR: "분석 중 오류가 발생했어요.",
  ANALYSIS_FAILED: "분석에 실패했어요.",
};

export const getFailureMessage = (failureReason) =>
  `${FAILURE_REASON_MESSAGES[failureReason] ?? FAILURE_REASON_MESSAGES.ANALYSIS_FAILED}\n사용한 크레딧은 모두 환불됐어요.`;
