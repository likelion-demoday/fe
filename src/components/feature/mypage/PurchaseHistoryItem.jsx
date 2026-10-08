import { Link } from "react-router-dom";
import Button from "../../common/Button";
import chevronRight from "../../../assets/icons/mypage-chevron-right.svg";

const PurchaseHistoryItem = ({
  title = "10회 이용권 구매",
  date = "2026.09.21",
  paymentMethod = "카카오페이",
  price = "17.000원",
  balanceAfter,
  to,
  onClick,
}) => {
  const className =
    "mypage-press-row mypage-press-padded flex w-full cursor-pointer items-center justify-between text-left text-[#262626]";
  const content = (
    <>
      <span className="flex flex-col items-start justify-center gap-[8px]">
        <span className="text-label">{title}</span>
        <span className="text-caption">
          {date} • {paymentMethod}
        </span>
        <span className="text-title-semibold">{price}</span>
        {balanceAfter !== undefined && (
          <span className="text-caption">
            잔액 {balanceAfter.toLocaleString("ko-KR")}크레딧
          </span>
        )}
      </span>
      {(to || onClick) && <img src={chevronRight} alt="" className="shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return <Button text={content} onClick={onClick} className={className} />;
  }

  return <div className={className.replace("cursor-pointer", "cursor-default")}>{content}</div>;
};

export default PurchaseHistoryItem;
