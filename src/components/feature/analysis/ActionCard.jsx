const ActionCard = ({ icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-[10px] overflow-clip rounded-[16px] bg-white px-[42px] py-[36px] shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]"
    >
      {icon}
      <span className="text-heading whitespace-nowrap text-black">{label}</span>
    </button>
  );
};

export default ActionCard;
