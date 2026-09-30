import BottomSheet from "../../common/BottomSheet";

export { SheetButton } from "../../common/BottomSheet";

const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`;
};

const RecordEndSheet = ({ elapsed, title, description, onClose, children }) => {
  return (
    <BottomSheet title={`${formatDuration(elapsed)} 녹음`} onClose={onClose} footer={children}>
      <div className="flex w-full flex-col items-center gap-[21px] whitespace-nowrap">
        <h3 className="text-heading text-black">{title}</h3>
        <p className="text-label text-[#595959]">{description}</p>
      </div>
    </BottomSheet>
  );
};

export default RecordEndSheet;
