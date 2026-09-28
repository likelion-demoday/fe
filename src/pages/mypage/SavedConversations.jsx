import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import SavedConversationItem from "../../components/feature/mypage/SavedConversationItem";
import Button from "../../components/common/Button";
import divider from "../../assets/icons/purchase-history-divider.svg";
import chevronDown from "../../assets/icons/conversation-chevron-down.svg";
import { mockConversations } from "../../mocks/conversations";

const SavedConversations = ({
  conversations = mockConversations,
  filterLabel = "개인 습관 분석",
  onFilter,
  onSelect,
}) => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader
        title="저장된 대화"
        titleClassName="text-heading"
        onBack={() => navigate("/mypage/recordings")}
      />
      <div className="flex flex-col gap-[8px]">
        <div className="flex justify-end">
          <Button
            onClick={onFilter}
            className="flex cursor-pointer items-center gap-[12px] rounded-[38px] px-[12px] py-[6px] font-['Pretendard','SUITE',sans-serif] text-[14px] leading-normal font-semibold tracking-[-0.28px] text-[#5f6473]"
            text={
              <>
                <span>{filterLabel}</span>
                <img src={chevronDown} alt="" className="shrink-0" />
              </>
            }
          />
        </div>
        <div className="flex flex-col gap-[26px]">
          {conversations.map(({ id, ...conversation }, index) => (
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
                onClick={() => onSelect?.(id)}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SavedConversations;
