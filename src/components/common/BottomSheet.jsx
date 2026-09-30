import xmarkIcon from "../../assets/icons/xmark.svg";
import characterImage from "../../assets/images/record-end-character.png";

// 페이지(390x844) 하단에 뜨는 바텀시트. 부모 요소에 relative 필요
const BottomSheet = ({ title, onClose, footer, children }) => {
  return (
    <div className="absolute inset-0 z-50 flex justify-center" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 flex h-[539px] w-full max-w-[390px] flex-col justify-between rounded-t-[32px] bg-white px-[24px] pt-[24px] pb-[30px]">
        <div className="flex w-full flex-col gap-[20px]">
          <div className="flex w-full justify-end">
            <button type="button" onClick={onClose} aria-label="닫기" className="size-[24px] shrink-0">
              <img src={xmarkIcon} alt="" className="block size-full max-w-none" />
            </button>
          </div>
          <div className="flex w-full flex-col items-center gap-[10px]">
            <h2 className="text-display w-full text-center text-black">{title}</h2>
            <div className="relative size-[136px] shrink-0 overflow-hidden">
              <img
                src={characterImage}
                alt=""
                className="pointer-events-none absolute top-[-4.41%] left-[-4.41%] size-[108.82%] max-w-none"
              />
            </div>
            {children}
          </div>
        </div>
        {footer && <div className="flex w-full gap-[12px]">{footer}</div>}
      </div>
    </div>
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
