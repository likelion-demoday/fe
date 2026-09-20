import arrowLeftIcon from "../../assets/icons/arrow-left.svg";

const BackButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="뒤로가기"
      className="relative size-[36px] shrink-0"
    >
      <img
        src={arrowLeftIcon}
        alt=""
        className="absolute inset-[-31.67%] block size-full max-w-none"
      />
    </button>
  );
};

export default BackButton;
