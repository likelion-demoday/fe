import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import CreditBalance from "../../components/feature/payments/CreditBalance";
import CreditProductCard from "../../components/feature/payments/CreditProductCard";
import chevronLeft from "../../assets/icons/chevron-left.svg";

// 메뉴들
const CREDIT_PRODUCTS = [
  { credits: 1000, price: 1000 },
  { credits: 3000, price: 3000 },
  { credits: 5500, price: 5000 },
  { credits: 11000, price: 10000 },
];

const CreditCharge = ({ balance = 12480, onPurchase }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <main className="relative mx-auto flex min-h-[844px] w-full max-w-[390px] flex-col bg-white">
      <div className="flex flex-col gap-[20px] px-[24px] pt-[16px]">
        <AppHeader title="크레딧 충전" />
        <Button
          onClick={() => navigate("/mypage/payments")}
          className="text-body flex w-fit cursor-pointer items-center gap-[8px] rounded-[6px] text-[#595959]"
          text={
            <>
              <img src={chevronLeft} alt="" className="shrink-0" />
              <span>뒤로가기</span>
            </>
          }
        />
        <div className="flex flex-col gap-[30px]">
          <CreditBalance balance={balance} />
          <section className="flex flex-col gap-[12px]">
            <h2 className="text-label text-black">
              충전할 크레딧을 선택해주세요
            </h2>
            <div className="flex flex-col gap-[16px]">
              {CREDIT_PRODUCTS.map((product) => (
                <CreditProductCard
                  key={product.credits}
                  {...product}
                  selected={selectedProduct?.credits === product.credits}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
      <footer className="sticky bottom-0 mt-auto bg-gradient-to-b from-transparent to-white to-[15.614%] px-[24px] pt-[20px] pb-[30px]">
        <Button
          text="결제하기"
          disabled={!selectedProduct}
          onClick={() => onPurchase?.(selectedProduct)}
          className="flex w-full items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] leading-[normal] font-semibold tracking-[0.04em] text-white enabled:cursor-pointer disabled:cursor-not-allowed"
        />
      </footer>
    </main>
  );
};

export default CreditCharge;
