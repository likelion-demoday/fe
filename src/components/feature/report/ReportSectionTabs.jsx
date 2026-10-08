import { useEffect, useRef } from "react";

// 선택된 섹션 제목은 크게 왼쪽에, 나머지는 작고 흐리게. 선택하면 왼쪽 끝으로 스크롤
const ReportSectionTabs = ({ sections, selected, onSelect }) => {
  const listRef = useRef(null);
  const tabRefs = useRef({});

  useEffect(() => {
    const tab = tabRefs.current[selected];
    if (listRef.current && tab) {
      listRef.current.scrollTo({ left: tab.offsetLeft - listRef.current.offsetLeft, behavior: "smooth" });
    }
  }, [selected]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="보고서 섹션"
      className="no-scrollbar relative -mr-[24px] flex items-end gap-[16px] overflow-x-auto pr-[24px] font-['SUIT',sans-serif] font-extrabold whitespace-nowrap"
    >
      {sections.map(({ key, label, disabled }) => {
        const isSelected = key === selected;
        return (
          <button
            key={key}
            ref={(el) => {
              tabRefs.current[key] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => onSelect(key)}
            className={`shrink-0 leading-normal transition-[font-size,color] duration-200 ${
              isSelected ? "text-[28px] tracking-[0.56px] text-[#262626]" : "text-[20px] text-[#eee]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ReportSectionTabs;
