import BottomSheet from "../../common/BottomSheet";

export { SheetButton } from "../../common/BottomSheet";

const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
};

// sheetTitle: 시트 상단 제목 (기본: "n분 n초 녹음"), description은 줄바꿈(\n) 그대로 표시
const RecordEndSheet = ({ elapsed, sheetTitle, title, description, image, preview, onClose, children }) => {
  return (
    <BottomSheet
      title={sheetTitle ?? `${formatDuration(elapsed)} 녹음`}
      onClose={onClose}
      footer={children}
      image={image}
    >
      <div className="flex w-full flex-col items-center gap-[21px] whitespace-nowrap">
        <h3 className="text-heading text-black">{title}</h3>
        <p className="text-label text-center whitespace-pre-line text-[#595959]">{description}</p>
        {preview}
      </div>
    </BottomSheet>
  );
};

export default RecordEndSheet;
