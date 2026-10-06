import { useState } from "react";
import BottomSheet, { SheetButton } from "../../common/BottomSheet";
import circleIcon from "../../../assets/icons/check-circle.svg";
import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import dividerIcon from "../../../assets/icons/divider.svg";

const AGREEMENTS = [
  { id: "payment", label: "[필수] 유료 서비스 이용 및 결제 동의" },
  { id: "refund", label: "[필수] 환불 및 취소 정책 확인" },
];

const CreditPaymentSheet = ({ product, onClose, onPurchase, onViewAgreement }) => {
  const [checked, setChecked] = useState({});
  const format = (value) => value.toLocaleString("ko-KR");
  const allChecked = AGREEMENTS.every(({ id }) => checked[id]);

  return (
    <BottomSheet
      title={<h2 className="text-display w-full text-left text-black">결제하기</h2>}
      onClose={onClose}
      showCharacter={false}
      contentGap="gap-[30px]"
      footer={
        <SheetButton
          text={`${format(product.price)}원 결제하기`}
          disabled={!allChecked}
          onClick={onPurchase}
        />
      }
    >
      <div className="flex w-full flex-col gap-[16px]">
        {[
          ["충전 크레딧", `${format(product.credits)}크레딧`],
          ["결제 금액", `${format(product.price)}원`],
        ].map(([label, value]) => (
          <div key={label} className="flex w-full items-start justify-between">
            <span className="text-title-medium text-[#595959]">{label}</span>
            <span className="text-title-semibold text-black">{value}</span>
          </div>
        ))}
      </div>
      <img src={dividerIcon} alt="" className="block h-px w-full shrink-0" />
      <div className="flex w-full flex-col gap-[20px]">
        {AGREEMENTS.map(({ id, label }) => (
          <div key={id} className="flex w-full items-center justify-between">
            <button
              type="button"
              aria-pressed={Boolean(checked[id])}
              onClick={() => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))}
              className="flex min-w-0 cursor-pointer items-center gap-[12px] text-left"
            >
              {checked[id] ? (
                <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full border-2 border-[#6b6b6b] bg-white">
                  <span className="size-[12px] rounded-full bg-[#454545]" />
                </span>
              ) : (
                <img src={circleIcon} alt="" className="size-[20px] shrink-0" />
              )}
              <span className="text-body text-[#262626]">{label}</span>
            </button>
            <button
              type="button"
              aria-label={`${label} 보기`}
              onClick={() => onViewAgreement?.(id)}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-[2px] rounded-[6px] px-[6px]"
            >
              <span className="text-caption text-[#8c8c8c]">보기</span>
              <img src={chevronRightIcon} alt="" className="h-[11px] w-[7px] shrink-0" />
            </button>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};

export default CreditPaymentSheet;
