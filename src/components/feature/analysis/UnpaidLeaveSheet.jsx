import BottomSheet, { SheetButton } from "../../common/BottomSheet";

// 결제 전에 분석 화면을 나가려 할 때 안내. 녹음은 3일 보관되고 홈에서 이어서 결제할 수 있음
const UnpaidLeaveSheet = ({ onStay, onLeave }) => (
  <BottomSheet
    title="분석을 그만둘까요?"
    onClose={onStay}
    footer={
      <>
        <SheetButton text="나가기" onClick={onLeave} />
        <SheetButton text="계속하기" onClick={onStay} />
      </>
    }
  >
    <p className="text-label text-center whitespace-pre-line text-[#595959]">
      {"결제하지 않은 녹음은 3일 뒤 삭제돼요\n그 전에는 홈에서 이어서 분석할 수 있어요"}
    </p>
  </BottomSheet>
);

export default UnpaidLeaveSheet;
