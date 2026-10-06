import BottomSheet, { SheetButton } from "../../common/BottomSheet";

const LogoutSheet = ({ onClose, onLogout }) => (
  <BottomSheet
    title="로그아웃"
    onClose={onClose}
    footer={
      <>
        <SheetButton text="취소" onClick={onClose} />
        <SheetButton text="로그아웃" onClick={onLogout} />
      </>
    }
  >
    <div className="flex w-full flex-col items-center gap-[21px] text-center">
      <h3 className="text-heading text-black">로그아웃 할까요?</h3>
      <p className="text-label text-[#595959]">
        로그아웃해도 기록은 모두 남아있어요
      </p>
    </div>
  </BottomSheet>
);

export default LogoutSheet;
