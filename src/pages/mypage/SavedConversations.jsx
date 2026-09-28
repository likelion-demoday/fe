import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import SavedConversationItem from "../../components/feature/mypage/SavedConversationItem";
import divider from "../../assets/icons/purchase-history-divider.svg";
import chevronDown from "../../assets/icons/conversation-chevron-down.svg";
import { mockConversations } from "../../mocks/conversations";

const SavedConversations = ({
  conversations = mockConversations,
  onSelect,
}) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("전체");
  const categories = [
    "전체",
    ...new Set(conversations.map((item) => item.category).filter(Boolean)),
  ];
  const filteredConversations = conversations.filter(
    (item) => category === "전체" || item.category === category,
  );

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader
        title="저장된 대화"
        titleClassName="text-heading"
        onBack={() => navigate("/mypage/recordings")}
      />
      <div className="flex flex-col gap-[8px]">
        <div className="flex justify-end">
          <div className="relative">
            <select
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
