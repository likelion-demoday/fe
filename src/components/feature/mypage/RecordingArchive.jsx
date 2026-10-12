import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "./MyPageHeader";
import SavedConversationItem from "./SavedConversationItem";
import divider from "../../../assets/icons/purchase-history-divider.svg";
import chevronDown from "../../../assets/icons/conversation-chevron-down.svg";
import ArchiveEmptyState from "./ArchiveEmptyState";

const RecordingArchive = ({
  title,
  items,
  initialCategory = "전체",
  emptyMessage = "아직 저장된 대화가 없어요",
  onSelect,
  loading = false,
  error = "",
  hasNext = false,
  onLoadMore,
  onRetry,
}) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(initialCategory);
  const categories = [
    "전체",
    ...new Set([
      ...(category === "전체" ? [] : [category]),
      ...items.map((item) => item.category).filter(Boolean),
    ]),
  ];
  const filteredConversations = items.filter(
    (item) => category === "전체" || item.category === category,
  );

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader
        title={title}
        titleClassName="text-heading"
        onBack={() => navigate("/mypage/recordings")}
      />
      <div className="flex flex-col gap-[8px]">
        <div className="flex justify-end">
          <div className="relative">
            <select
              aria-label="분류 선택"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="active:bg-[#eeeeee] cursor-pointer appearance-none rounded-[38px] bg-transparent py-[6px] pr-[35px] pl-[12px] font-['Pretendard','SUITE',sans-serif] text-[14px] leading-normal font-semibold tracking-[-0.28px] text-[#5f6473]"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <img
              src={chevronDown}
              alt=""
              className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2"
            />
          </div>
        </div>
        {loading && <p role="status">목록을 불러오는 중...</p>}
        {error && (
          <div>
            <p role="alert">{error}</p>
            <button type="button" onClick={onRetry} disabled={loading}>
              다시 시도
            </button>
          </div>
        )}
        {filteredConversations.length === 0 ? (
          !loading &&
          !error && (
            <ArchiveEmptyState
              className="mt-[152px]"
              message={
                items.length === 0
                  ? emptyMessage
                  : "해당 분류에 저장된 항목이 없어요"
              }
            />
          )
        ) : (
          <div className="flex flex-col gap-[26px]">
            {filteredConversations.map(({ id, ...conversation }, index) => (
              <Fragment key={id}>
                {index > 0 && (
                  <div className="relative h-0">
                    <img
                      src={divider}
                      alt=""
                      className="absolute -top-px left-0"
                    />
                  </div>
                )}
                <SavedConversationItem
                  {...conversation}
                  onClick={onSelect ? () => onSelect(id) : undefined}
                />
              </Fragment>
            ))}
          </div>
        )}
        {hasNext && !error && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="mt-[20px] rounded-[12px] border border-[#eee] py-[12px] disabled:opacity-50"
          >
            더 보기
          </button>
        )}
      </div>
    </main>
  );
};

export default RecordingArchive;
