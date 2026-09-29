import xmarkIcon from "../../../assets/icons/xmark.svg";
import characterImage from "../../../assets/images/record-end-character.png";

const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
};

// 녹음 종료 시 뜨는 바텀시트 (종료 확인 / 저장 여부 공통)
const RecordEndSheet = ({ elapsed, title, description, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 flex w-full max-w-[390px] flex-col gap-[120px] rounded-t-[32px] bg-white px-[24px] pt-[24px] pb-[30px]">
        <div className="flex w-full flex-col gap-[20px]">
          <div className="flex w-full justify-end">
            <button type="button" onClick={onClose} aria-label="닫기" className="size-[24px] shrink-0">
              <img src={xmarkIcon} alt="" className="block size-full max-w-none" />
            </button>
          </div>
          <div className="flex w-full flex-col items-center gap-[10px]">
            <p className="text-display w-full text-center text-black">{formatDuration(elapsed)} 녹음</p>
            <div className="relative size-[136px] shrink-0 overflow-hidden">
              <img
                src={characterImage}
                alt=""
                className="pointer-events-none absolute top-[-4.41%] left-[-4.41%] size-[108.82%] max-w-none"
              />
            </div>
            <div className="flex w-full flex-col items-center gap-[21px] whitespace-nowrap">
              <h2 className="text-heading text-black">{title}</h2>
              <p className="text-label text-[#595959]">{description}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-[12px]">{children}</div>
      </div>
    </div>
  );
};

export const SheetButton = ({ text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-w-px flex-1 items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] font-semibold tracking-[0.8px] whitespace-nowrap text-white"
  >
    {text}
  </button>
);

export default RecordEndSheet;
