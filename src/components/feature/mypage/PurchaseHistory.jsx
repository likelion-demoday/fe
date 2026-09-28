import { Link } from "react-router-dom";
import Button from "../../common/Button";
import chevronRight from "../../../assets/icons/mypage-chevron-right.svg";

const PurchaseHistory = ({ to, onClick }) => {
  const className =
    "text-label flex w-full cursor-pointer items-center justify-between py-[12px] text-left text-[#262626]";
  const content = (
    <>
      <span>구매 내역</span>
      <img src={chevronRight} alt="" className="shrink-0" />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <Button text={content} onClick={onClick} className={className} />;
};

export default PurchaseHistory;
