// 현재 페이지 공유: 공유 시트가 있으면 사용하고, 없으면 링크 복사
export const shareCurrentPage = async (message) => {
  const text = `${message}\n${window.location.href}`;

  if (navigator.share) {
    try {
      await navigator.share({ text });
    } catch {
      // 사용자가 공유를 취소한 경우
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    alert("링크를 복사했어요.");
  } catch {
    alert("링크를 복사하지 못했어요.");
  }
};
