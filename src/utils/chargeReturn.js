// 크레딧 충전 후 돌아갈 화면. 결제창을 거치며 페이지가 새로 열려도 남도록 저장
// value: { path, state, savedAt }. 충전을 그만두고 나중에 따로 충전한 경우를 걸러내려고 유효 시간을 둠
const CHARGE_RETURN_KEY = "chargeReturn";
const CHARGE_RETURN_TTL_MS = 60 * 60 * 1000;

export const saveChargeReturn = (path, state) => {
  localStorage.setItem(CHARGE_RETURN_KEY, JSON.stringify({ path, state, savedAt: Date.now() }));
};

export const clearChargeReturn = () => {
  localStorage.removeItem(CHARGE_RETURN_KEY);
};

export const getChargeReturn = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CHARGE_RETURN_KEY));
    if (saved && Date.now() - saved.savedAt < CHARGE_RETURN_TTL_MS) return saved;
  } catch {
    // 값이 깨진 경우 없는 것으로 처리
  }
  clearChargeReturn();
  return null;
};
