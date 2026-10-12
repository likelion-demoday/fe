import BottomSheet, { SheetButton } from "../../common/BottomSheet";
import dividerIcon from "../../../assets/icons/purchase-divider.svg";

const formatCredit = (value) => value.toLocaleString("ko-KR");

const PurchaseSheet = ({ productName, ownedCredit, price, onClose, onPurchase, onCharge }) => {
  const remaining = ownedCredit - price;
  const isShort = remaining < 0;

  return (
    <BottomSheet
      title={isShort ? "크레딧이 부족해요" : "구매하기"}
      onClose={onClose}
      footer={
        isShort ? (
          <SheetButton text="크레딧 충전하러 가기" onClick={onCharge} />
        ) : (
          <SheetButton text={`${formatCredit(price)}크레딧 결제하기`} onClick={onPurchase} />
        )
      }
    >
      <div className="flex w-full flex-col items-center gap-[21px]">
        <h3 className="text-heading whitespace-nowrap text-black">{productName}</h3>
        <div className="text-label flex flex-col items-center gap-[8px] whitespace-nowrap text-[#595959]">
          <div className="flex flex-col items-center gap-[4px]">
            <p>보유 크레딧 {formatCredit(ownedCredit)}</p>
            <p>사용 크레딧 {formatCredit(price)}</p>
          </div>
          {!isShort && (
            <>
              <img src={dividerIcon} alt="" className="block h-px w-full max-w-none" />
              <p>구매 후 크레딧 {formatCredit(remaining)}</p>
            </>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};

export default PurchaseSheet;
