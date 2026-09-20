import Input from "./Input";

/**
 * 밑줄 스타일 입력 필드 (라벨 + 입력 + 우측 액션 + 안내 문구)
 */
const TextField = ({
  id,
  label,
  helperText,
  trailing,
  type = "text",
  value,
  onChange,
  placeholder,
  ...rest
}) => {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <div className="flex w-full flex-col items-start gap-[6px]">
        <label
          htmlFor={id}
          className="w-full font-['SUITE',sans-serif] text-[13px] font-medium tracking-[0.39px] text-[#595959]"
        >
          {label}
        </label>
        <div className="flex w-full items-center justify-between gap-[8px] border-b-[1.5px] border-[#dfe2ea] pb-[6px]">
          <Input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-transparent font-['SUITE',sans-serif] text-[16px] font-semibold text-[#262626] outline-none placeholder:text-[#d9d9d9]"
            {...rest}
          />
          {trailing}
        </div>
      </div>
      {helperText && (
        <p className="w-full font-['SUITE',sans-serif] text-[12px] font-medium text-[#bfbfbf]">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;
