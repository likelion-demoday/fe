import { useEffect, useId, useRef, useState } from "react";
import chevronDown from "../../../assets/icons/conversation-chevron-down.svg";

const ArchiveCategoryPicker = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const trigger = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event) => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={container} className="relative font-['Pretendard','SUITE',sans-serif] text-[14px] leading-normal font-semibold tracking-[-0.28px] text-[#5f6473]" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button
        ref={trigger}
        type="button"
        aria-label={`분류 선택: ${value}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((previous) => !previous)}
        className="flex cursor-pointer items-center gap-[24px] rounded-[38px] py-[6px] pr-[12px] pl-[12px] hover:bg-[#eeeeee]"
      >
        <span>{value}</span>
        <img src={chevronDown} alt="" />
      </button>
      {open && (
        <div id={menuId} role="group" aria-label="카테고리" className="absolute top-full right-0 z-20 mt-[8px] flex min-w-full flex-col gap-[8px] bg-white">
          {options.filter((option) => option !== value).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={value === option}
              onClick={() => {
                onChange(option);
                setOpen(false);
                trigger.current?.focus();
              }}
              className="flex cursor-pointer items-center justify-between gap-[24px] rounded-[38px] py-[6px] pr-[12px] pl-[12px] text-left whitespace-nowrap hover:bg-[#eeeeee]"
            >
              <span>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveCategoryPicker;
