const ActionCard = ({ icon, label, description, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer transition-colors active:bg-[#eee] flex w-full flex-col items-center justify-center overflow-clip rounded-[16px] border border-[#eee] bg-white px-[42px] pt-[36px] ${description ? "pb-[30px]" : "pb-[36px]"} shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_49.1px_0px_rgba(0,0,0,0.1)]`}
    >
      <span className="flex flex-col items-end gap-px">
        <span className="flex items-center gap-[10px]">
          {icon}
          <span className="text-heading whitespace-nowrap text-black">{label}</span>
        </span>
        {description && <span className="text-caption text-right text-[#595959]">{description}</span>}
      </span>
    </button>
  );
};

export default ActionCard;
