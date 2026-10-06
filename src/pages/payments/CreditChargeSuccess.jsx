import { useNavigate } from "react-router-dom";
import CreditChargeResult from "../../components/feature/payments/CreditChargeResult";

const CreditChargeSuccess = () => {
  const navigate = useNavigate();

  return (
    <CreditChargeResult
      title="충천 완료!"
      buttonText="대화 분석하러 가기"
      onClick={() => navigate("/analysis")}
    />
  );
};

export default CreditChargeSuccess;
