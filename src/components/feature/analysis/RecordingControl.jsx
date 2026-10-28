const RecordingControl = ({ active, onClick, disabled, label, children, iconIncludesShadow = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    aria-pressed={active}
    className={`relative flex size-[90px] shrink-0 items-center justify-center rounded-[20px] disabled:cursor-not-allowed ${
      active
        ? "bg-[#ffb0a0] shadow-[0px_0px_30px_0px_rgba(255,118,91,0.3)]"
        : iconIncludesShadow ? "bg-white" : "bg-white shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]"
    }`}
  >
    {active ? (
      <span className="relative size-[40px] overflow-clip">
        <span className="absolute top-[5px] left-[7px] h-[30px] w-[8px] rounded-[1px] bg-white" />
        <span className="absolute top-[5px] left-[24px] h-[30px] w-[8px] rounded-[1px] bg-white" />
      </span>
    ) : children}
  </button>
);

export default RecordingControl;
