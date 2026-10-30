import { useEffect } from "react";
import { createPortal } from "react-dom";
import xmarkIcon from "../../assets/icons/xmark.svg";
import characterImage from "../../assets/images/record-end-character.png";

// 실제 뷰포트 하단에 표시하고 긴 내용은 시트 내부에서 스크롤합니다.
// title: 문자열이면 기본 제목 스타일, 요소면 그대로 렌더링 (예: 입력창)
// image: 캐릭터 자리 이미지 교체용 { src, className } (className은 136px 상자 안 위치·크기)
const DEFAULT_IMAGE = {
  src: characterImage,
  className: "top-[-4.41%] left-[-4.41%] size-[108.82%]",
};

const BottomSheet = ({
  title,
  onClose,
  footer,
  children,
  headerGap = "gap-[20px]",
  contentGap = "gap-[10px]",
  showCharacter = true,
  image = DEFAULT_IMAGE,
}) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-x-0 top-0 z-50 mx-auto flex h-dvh w-full max-w-[390px] items-end justify-center overflow-hidden overscroll-none" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex h-[539px] max-h-[calc(100dvh-16px)] w-full max-w-[390px] flex-col gap-[20px] overflow-hidden rounded-t-[32px] bg-white px-[24px] pt-[24px] pb-[max(30px,env(safe-area-inset-bottom))]">
        <div className={`flex min-h-0 w-full flex-1 flex-col ${headerGap}`}>
          <div className="flex w-full shrink-0 justify-end">
            <button type="button" onClick={onClose} aria-label="닫기" className="press-control size-[24px] shrink-0 rounded-[6px]">
              <img src={xmarkIcon} alt="" className="block size-full max-w-none" />
            </button>
          </div>
          <div className={`flex min-h-0 w-full flex-col items-center overflow-x-hidden overflow-y-auto overscroll-contain ${contentGap}`}>
            {typeof title === "string" ? (
              <h2 className="text-display w-full text-center text-black">{title}</h2>
            ) : (
              title
            )}
            {showCharacter && <div className="relative size-[136px] shrink-0 overflow-hidden">
              <img
                src={image.src}
                alt=""
                className={`pointer-events-none absolute max-w-none ${image.className}`}
              />
            </div>}
            {children}
          </div>
        </div>
        {footer && <div className="flex w-full shrink-0 gap-[12px]">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};

export const SheetButton = ({ text, onClick, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex min-w-px flex-1 items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] whitespace-nowrap text-white disabled:bg-[#d9d9d9]"
  >
    {text}
  </button>
);

export default BottomSheet;
