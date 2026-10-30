import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMyCredits } from "../../api/credit";
import { createPaymentOrder, getPaymentProducts, requestNicePay } from "../../api/payment";
import AppHeader from "../../components/common/AppHeader";
import Button from "../../components/common/Button";
import CreditBalance from "../../components/feature/payments/CreditBalance";
import CreditProductCard from "../../components/feature/payments/CreditProductCard";
import CreditPaymentSheet from "../../components/feature/payments/CreditPaymentSheet";
import TextBackButton from "../../components/common/TextBackButton";

const CreditCharge = ({ onViewAgreement }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkout = location.state?.checkout;
  const [agreements, setAgreements] = useState(checkout?.agreements ?? {});
  const [balance, setBalance] = useState(null);
  const [creditError, setCreditError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(checkout?.product ?? null);
  const [paymentOpen, setPaymentOpen] = useState(Boolean(checkout));
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
    <main className="relative mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col bg-white">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-[20px] overflow-y-auto px-[24px] pt-[16px]">
        <AppHeader title="크레딧 충전" onLogoClick={() => navigate("/home")} />
        <TextBackButton onClick={() => navigate("/mypage/payments")} />
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
      <footer className="shrink-0 bg-gradient-to-b from-transparent to-white to-[15.614%] px-[24px] pt-[20px] pb-[max(30px,env(safe-area-inset-bottom))]">
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
          checked={agreements}
          onCheckedChange={setAgreements}
          onClose={() => { if (!paymentPending.current) setPaymentOpen(false); }}
          isPaying={isPaying}
          error={paymentError}
          onPurchase={() => handlePurchase(selectedProduct)}
          onViewAgreement={(id) => {
            if (onViewAgreement) {
              onViewAgreement(id);
              return;
            }
            const path = id === "refund"
              ? "/mypage/support/policies/payment-refund"
              : "/mypage/support/policies/terms";
            navigate(location.pathname, {
              replace: true,
              state: { ...location.state, checkout: { product: selectedProduct, agreements } },
            });
            navigate(path, { state: { fromCreditPayment: true } });
          }}
        />
      )}
    </main>
  );
};

export default CreditCharge;
