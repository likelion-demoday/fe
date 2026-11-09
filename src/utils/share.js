// http 주소(폰에서 IP로 접속 등)에는 navigator.share·clipboard가 없어서 옛 방식으로 복사
const copyWithSelection = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.readOnly = true;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
};

// 공유 시트가 있으면 사용하고, 없으면 클립보드에 복사
// 브라우저는 사용자가 누른 직후에만 허용해서, API 응답을 기다린 뒤 호출하면 거절될 수 있음 → 이때 false 반환
export const shareText = async (text) => {
  if (navigator.share) {
    try {
      await navigator.share({ text });
    } catch (e) {
      // AbortError: 사용자가 공유를 취소한 경우
      return e.name !== "NotAllowedError";
    }
    return true;
  }

  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(text);
    else if (!copyWithSelection(text)) return false;
    alert("링크를 복사했어요.");
    return true;
  } catch {
    return false;
  }
};
