import { useNavigate } from "react-router-dom";
import CreditChargeResult from "../../components/feature/payments/CreditChargeResult";

const CreditChargeFailure = () => {
  const navigate = useNavigate();

  return (
    <CreditChargeResult
      title="결제가 완료되지 않았어요."
      buttonText="돌아가기"
      onClick={() => navigate("/payments")}
    />
  );
};

export default CreditChargeFailure;
