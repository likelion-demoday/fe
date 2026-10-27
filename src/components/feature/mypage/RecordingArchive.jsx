import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "./MyPageHeader";
import SavedConversationItem from "./SavedConversationItem";
import divider from "../../../assets/icons/purchase-history-divider.svg";
import ArchiveCategoryPicker from "./ArchiveCategoryPicker";
import { ARCHIVE_CATEGORIES, matchesArchiveCategory } from "../../../utils/archiveCategory";
import ArchiveEmptyState from "./ArchiveEmptyState";
import archiveEmptyImage from "../../../assets/images/archive-empty.png";

const RecordingArchive = ({
  title,
  items,
  initialCategory = "친구관계",
  emptyMessage = "아직 저장된 대화가 없어요",
  onSelect,
  loading = false,
  error = "",
  hasNext = false,
  onLoadMore,
  onRetry,
}) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(ARCHIVE_CATEGORIES.includes(initialCategory) ? initialCategory : "친구관계");
  const filteredConversations = items.filter(
    (item) => matchesArchiveCategory(item, category),
  );

  // 분류 선택 시 뒤쪽 페이지의 일치 항목도 빠짐없이 조회합니다.
  useEffect(() => {
    if (hasNext && !loading && !error) onLoadMore?.();
  }, [category, hasNext, loading, error, onLoadMore]);

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader
        title={title}
        titleClassName="text-heading"
        onBack={() => navigate("/mypage/recordings")}
      />
      <div className="flex flex-col gap-[8px]">
        <div className="flex justify-end">
          <ArchiveCategoryPicker value={category} options={ARCHIVE_CATEGORIES} onChange={setCategory} />
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
              imageSrc={archiveEmptyImage}
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
