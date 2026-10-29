import BottomSheet, { SheetButton } from "../../common/BottomSheet";
import accountExitImage from "../../../assets/images/account-exit.png";

const LogoutSheet = ({ onClose, onLogout, isLoggingOut = false, error }) => (
  <BottomSheet
    title="로그아웃"
    image={{ src: accountExitImage, className: "inset-0 size-full object-cover" }}
    onClose={onClose}
    footer={
      <>
        <SheetButton text="취소" onClick={onClose} disabled={isLoggingOut} />
        <SheetButton text={isLoggingOut ? "로그아웃 중..." : "로그아웃"} onClick={onLogout} disabled={isLoggingOut} />
      </>
    }
  >
    <div className="flex w-full flex-col items-center gap-[21px] text-center">
      <h3 className="text-heading text-black">로그아웃 할까요?</h3>
      <p className="text-label text-[#595959]">
        로그아웃해도 기록은 모두 남아있어요
      </p>
      {error && <p role="alert" className="text-caption text-red-600">{error}</p>}
    </div>
  </BottomSheet>
);

export default LogoutSheet;
