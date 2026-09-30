import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import PurchaseHistoryItem from "../../components/feature/mypage/PurchaseHistoryItem";
import divider from "../../assets/icons/purchase-history-divider.svg";

import { mockPurchases } from "../../mocks/purchases";

const PurchaseHistoryPage = ({ purchases = mockPurchases, onSelect }) => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[36px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader
        title="구매내역"
        titleClassName="text-heading"
        onBack={() => navigate("/mypage/payments")}
      />
      <div className="flex flex-col gap-[26px]">
        {purchases.map(({ id, ...purchase }, index) => (
          <Fragment key={id}>
            {index > 0 && (
              <div className="relative h-0">
                <img src={divider} alt="" className="absolute -top-px left-0" />
              </div>
            )}
            <PurchaseHistoryItem {...purchase} onClick={() => onSelect?.(id)} />
          </Fragment>
        ))}
      </div>
    </main>
  );
};

export default PurchaseHistoryPage;
