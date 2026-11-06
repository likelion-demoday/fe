// 이어하기용 분석 정보 목록 (녹음 업로드 후 ~ 분석 완료/실패 전). 화면을 나가도 홈에서 이어갈 수 있게 저장
// 각 항목: 분석 화면 사이에서 넘기던 navigate state (recordingId, partner, elapsed, type, relation, phase)
//   + paid(결제 여부), savedAt(처음 저장한 시각)
const PENDING_ANALYSES_KEY = "pendingAnalyses";
const LEGACY_KEY = "pendingAnalysis"; // 예전 단일 저장 키

// 백엔드는 결제하지 않은 녹음을 3일 뒤 삭제함
export const UNPAID_RETENTION_MS = 3 * 24 * 60 * 60 * 1000;

const read = () => {
  try {
    const list = JSON.parse(localStorage.getItem(PENDING_ANALYSES_KEY)) ?? [];
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
    // 예전 키는 결제 후에만 저장했으므로 결제한 항목으로 옮김
    if (legacy?.recordingId && !list.some((item) => item.recordingId === legacy.recordingId)) {
      list.push({ ...legacy, paid: true, savedAt: Date.now() });
    }
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const write = (list) => {
  try {
    localStorage.setItem(PENDING_ANALYSES_KEY, JSON.stringify(list));
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // 저장소를 못 쓰면 이어하기만 안 됨
  }
};

const isExpired = (item, now) => !item.paid && now - (item.savedAt ?? 0) > UNPAID_RETENTION_MS;

// 같은 녹음이면 기존 정보에 덮어씀 (처음 저장 시각과 결제 여부는 유지)
export const savePendingAnalysis = (entry) => {
  if (!entry?.recordingId) return;
  const list = read();
  const prev = list.find((item) => item.recordingId === entry.recordingId);
  const next = {
    ...prev,
    ...entry,
    paid: Boolean(entry.paid ?? prev?.paid),
    savedAt: prev?.savedAt ?? Date.now(),
  };
  write([...list.filter((item) => item.recordingId !== entry.recordingId), next]);
};

// 보관 기간(3일)이 지난 미결제 녹음은 빼고 반환
export const getPendingAnalyses = () => {
  const now = Date.now();
  const list = read();
  const valid = list.filter((item) => item.recordingId && !isExpired(item, now));
  if (valid.length !== list.length) write(valid);
  return valid;
};

export const removePendingAnalysis = (recordingId) => {
  write(read().filter((item) => item.recordingId !== recordingId));
};

// 미결제 녹음이 삭제되기까지 남은 일수 (올림)
export const daysUntilDeleted = (item) =>
  Math.max(1, Math.ceil(((item.savedAt ?? Date.now()) + UNPAID_RETENTION_MS - Date.now()) / (24 * 60 * 60 * 1000)));
