import chevronLeftIcon from "../../assets/icons/chevron-left.svg";

const TextBackButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center self-start justify-center gap-[8px] rounded-[6px]"
    >
      <img src={chevronLeftIcon} alt="" className="block h-[13px] w-[8px] max-w-none shrink-0" />
      <span className="text-body whitespace-nowrap text-[#595959]">뒤로가기</span>
    </button>
  );
};

export default TextBackButton;
