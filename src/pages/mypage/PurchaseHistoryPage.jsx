import { Fragment, useEffect, useRef, useState } from "react";
import { getCreditHistory } from "../../api/credit";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import PurchaseHistoryItem from "../../components/feature/mypage/PurchaseHistoryItem";
import ArchiveEmptyState from "../../components/feature/mypage/ArchiveEmptyState";
import divider from "../../assets/icons/purchase-history-divider.svg";

const PurchaseHistoryPage = ({ onSelect }) => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestPending = useRef(false);

  useEffect(() => {
    let active = true;
    getCreditHistory()
      .then((history) => {
        if (!active) return;
        setPurchases(history.items);
        setPage(history.page);
        setHasNext(history.hasNext);
      })
      .catch((error) => {
        if (active) setError(error?.message || "크레딧 내역을 불러오지 못했어요.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const loadHistory = async () => {
    if (requestPending.current) return;
    requestPending.current = true;
    setLoading(true);
    setError("");
    try {
      const history = await getCreditHistory({ page: purchases.length ? page + 1 : 0 });
      setPurchases((previous) => [...previous, ...history.items]);
      setPage(history.page);
      setHasNext(history.hasNext);
    } catch (error) {
      setError(error?.message || "크레딧 내역을 불러오지 못했어요.");
    } finally {
      requestPending.current = false;
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[36px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader
        title="구매내역"
        titleClassName="text-heading"
        onBack={() => navigate("/mypage/payments")}
      />
      {loading && <p role="status">크레딧 내역을 불러오는 중...</p>}
      {error && (
        <div className="flex flex-col gap-[12px]">
          <p role="alert">{error}</p>
          <button type="button" onClick={loadHistory} disabled={loading}>다시 시도</button>
        </div>
      )}
      {!loading && !error && purchases.length === 0 ? (
        <ArchiveEmptyState
          message="아직 크레딧 내역이 없어요"
          className="mt-[157px]"
        />
      ) : (
        <div className="flex flex-col gap-[26px]">
          {purchases.map((purchase, index) => (
            <Fragment key={purchase.id}>
              {index > 0 && (
                <div className="relative h-0">
                  <img
                    src={divider}
                    alt=""
                    className="absolute -top-px left-0"
                  />
                </div>
              )}
              <PurchaseHistoryItem
                title={purchase.purpose === "ANALYSIS" ? "대화 분석" : purchase.purpose || "크레딧 내역"}
                date={new Date(purchase.createdAt).toLocaleString("ko-KR")}
                paymentMethod={purchase.type === "USE" ? "크레딧 사용" : purchase.type}
                price={`${purchase.amount.toLocaleString("ko-KR")}크레딧`}
                balanceAfter={purchase.balanceAfter}
                onClick={onSelect ? () => onSelect(purchase.id) : undefined}
              />
            </Fragment>
          ))}
        </div>
      )}
      {hasNext && !error && (
        <button type="button" onClick={loadHistory} disabled={loading} className="rounded-[12px] border border-[#eee] py-[12px] disabled:opacity-50">
          더 보기
        </button>
      )}
    </main>
  );
};

export default PurchaseHistoryPage;
