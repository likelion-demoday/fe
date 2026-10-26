import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCredits } from "../../api/credit";
import { createPaymentOrder, getPaymentProducts, requestNicePay } from "../../api/payment";
import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import CreditBalance from "../../components/feature/payments/CreditBalance";
import CreditProductCard from "../../components/feature/payments/CreditProductCard";
import CreditPaymentSheet from "../../components/feature/payments/CreditPaymentSheet";
import chevronLeft from "../../assets/icons/chevron-left.svg";

const CreditCharge = ({ onViewAgreement }) => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [creditError, setCreditError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [products, setProducts] = useState(null);
  const [productError, setProductError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const paymentPending = useRef(false);

  useEffect(() => {
    let active = true;

    const fetchCredits = async () => {
      try {
        const credits = await getMyCredits();
        if (active) {
          setBalance(credits.balance);
        }
      } catch (error) {
        if (active) {
          setCreditError(error?.message || "크레딧을 불러오지 못했어요.");
        }
      }
    };

    fetchCredits();
    getPaymentProducts().then(({ products }) => {
      if (active) setProducts(products.map(({ code, amount, credits }) => ({
        productCode: code, price: amount, credits,
      })));
    }).catch((error) => {
      if (active) setProductError(error?.message || "충전 상품을 불러오지 못했어요.");
    });

    return () => {
      active = false;
    };
  }, []);

  const handlePurchase = async (product) => {
    if (paymentPending.current) return;
    paymentPending.current = true;
    setIsPaying(true);
    setPaymentError("");
    const handleError = (error) => {
      paymentPending.current = false;
      setIsPaying(false);
      setPaymentError(error?.message || "결제를 시작하지 못했어요. 다시 시도해주세요.");
    };
    try {
      const order = await createPaymentOrder(product.productCode);
      requestNicePay({ ...order, onError: handleError });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <main className="relative mx-auto flex min-h-[844px] w-full max-w-[390px] flex-col bg-white">
      <div className="flex flex-col gap-[20px] px-[24px] pt-[16px]">
        <AppHeader title="크레딧 충전" onLogoClick={() => navigate("/mypage")} />
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
          {creditError ? (
            <p role="alert" className="text-body text-[#595959]">
              {creditError}
            </p>
          ) : balance === null ? (
            <p role="status" className="text-body text-[#595959]">
              보유 크레딧을 불러오는 중...
            </p>
          ) : (
            <CreditBalance balance={balance} />
          )}
          <section className="flex flex-col gap-[12px]">
            <h2 className="text-label text-black">
              충전할 크레딧을 선택해주세요
            </h2>
            <div className="flex flex-col gap-[16px]">
              {productError ? <p role="alert">{productError}</p> : products === null ?
                <p role="status">충전 상품을 불러오는 중...</p> : products.length === 0 ?
                <p>충전 가능한 상품이 없습니다.</p> : products.map((product) => (
                <CreditProductCard
                  key={product.productCode}
                  {...product}
                  selected={selectedProduct?.productCode === product.productCode}
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
          disabled={!selectedProduct || isPaying}
          onClick={() => { setPaymentError(""); setPaymentOpen(true); }}
          className="flex w-full items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] leading-[normal] font-semibold tracking-[0.04em] text-white enabled:cursor-pointer disabled:cursor-not-allowed"
        />
      </footer>
      {paymentOpen && selectedProduct && (
        <CreditPaymentSheet
          product={selectedProduct}
          onClose={() => { if (!paymentPending.current) setPaymentOpen(false); }}
          isPaying={isPaying}
          error={paymentError}
          onPurchase={() => handlePurchase(selectedProduct)}
          onViewAgreement={onViewAgreement}
        />
      )}
    </main>
  );
};

export default CreditCharge;
