import { useEffect, useRef } from "react";

// 선택된 섹션 제목은 크게 왼쪽에, 나머지는 작고 흐리게. 선택하면 왼쪽 끝으로 스크롤
const ReportSectionTabs = ({ sections, selected, onSelect }) => {
  const listRef = useRef(null);
  const tabRefs = useRef({});
  const spacerRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const tab = tabRefs.current[selected];
    if (!list || !tab || !spacerRef.current) return;

    // offsetLeft는 목록 기준 위치(왼쪽 패딩 포함). 선택된 제목을 본문 왼쪽 줄에 맞춤
    const target = tab.offsetLeft - parseFloat(getComputedStyle(list).paddingLeft);

    // 뒤쪽 제목도 왼쪽까지 올 수 있도록 부족한 스크롤 길이만큼 끝에 여백 추가
    spacerRef.current.style.width = "0px";
    const maxScroll = list.scrollWidth - list.clientWidth;
    spacerRef.current.style.width = `${Math.max(0, target - maxScroll)}px`;

    list.scrollTo({ left: target, behavior: "smooth" });
  }, [selected]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="보고서 섹션"
      // 화면 양끝까지 넓혀서 이전·다음 제목이 가장자리에 걸쳐 보이게 함
      className="no-scrollbar relative -mx-[24px] flex items-end gap-[16px] self-stretch overflow-x-auto px-[24px] font-['SUIT',sans-serif] font-extrabold whitespace-nowrap"
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
            className={`shrink-0 leading-normal transition-colors duration-200 ${
              isSelected ? "text-[28px] tracking-[0.56px] text-[#262626]" : "text-[20px] text-[#eee]"
            }`}
          >
            {label}
          </button>
        );
      })}
      <span ref={spacerRef} className="shrink-0" aria-hidden="true" />
    </div>
  );
};

export default ReportSectionTabs;
