import BottomSheet, { SheetButton } from "../../common/BottomSheet";
import accountExitImage from "../../../assets/images/account-exit.png";

const WithdrawSheet = ({ onClose, onWithdraw }) => (
  <BottomSheet
    title="회원 탈퇴"
    characterSrc={accountExitImage}
    characterClassName="pointer-events-none block size-full object-cover"
    onClose={onClose}
    footer={
      <>
        <SheetButton text="취소" onClick={onClose} />
        <SheetButton text="회원탈퇴" onClick={onWithdraw} />
      </>
    }
  >
    <div className="flex w-full flex-col items-center gap-[21px] text-center">
      <h3 className="text-heading text-black">정말 탈퇴하시겠어요?</h3>
      <p className="text-label text-[#595959]">
        탈퇴하면 저장된 대화와 크레딧, 보고서가
        <br />
        삭제되고 복구할 수 없어요.
      </p>
    </div>
  </BottomSheet>
);

export default WithdrawSheet;
