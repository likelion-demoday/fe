import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPayment } from "../../api/payment";
import CreditChargeResult from "../../components/feature/payments/CreditChargeResult";
import creditChargeSuccessImage from "../../assets/images/credit-charge-success.png";

const CreditChargeStatus = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    let timer;
    const fetchPayment = async () => {
      try {
        const payment = await getPayment(orderId);
        if (!active) return;
        setResult(payment);
        setError("");
        if (payment.status === "APPROVING") timer = setTimeout(fetchPayment, 2500);
      } catch (error) {
        if (active) setError(error?.message || "결제 결과를 불러오지 못했어요.");
      }
    };
    fetchPayment();
    return () => { active = false; clearTimeout(timer); };
  }, [orderId, attempt]);

  const payment = result?.orderId === orderId ? result : null;
  const paid = payment?.status === "PAID";
  let title = "결제 결과를 확인하고 있어요.";
  if (!orderId) title = "결제 주문번호가 없습니다.";
  else if (error) title = error;
  else if (paid) title = "충전 완료!";
  else if (payment?.status === "FAILED") title = payment.failMessage || "결제가 완료되지 않았어요.";
  else if (["READY", "EXPIRED"].includes(payment?.status)) title = "결제되지 않은 주문입니다. 다시 결제해주세요.";

  return <CreditChargeResult
    successImage={paid && !error ? creditChargeSuccessImage : undefined}
    title={title}
    buttonText={error ? "다시 확인하기" : paid ? "대화 분석하러 가기" : "충전 화면으로 돌아가기"}
    onClick={() => error ? setAttempt((value) => value + 1) : navigate(paid ? "/analysis" : "/payments")}
  />;
};

export default CreditChargeStatus;
