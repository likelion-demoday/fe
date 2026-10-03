import { useNavigate } from "react-router-dom";
import profileIcon from "../../assets/icons/profile.svg";
import TextBackButton from "./TextBackButton";

const AppHeader = ({ title, onBack }) => {
  const navigate = useNavigate();

  return (
    <header className="flex w-full flex-col gap-[20px]">
      <div className="flex h-[40px] items-center justify-between">
        <p className="font-['SUIT',sans-serif] text-[20px] leading-normal font-extrabold tracking-[-0.8px] whitespace-nowrap text-black">
          <span>RE</span>
          <span className="text-[#ff765b]">:S</span>
          <span className="tracking-[-1.28px]">AY</span>
        </p>
        <button
          type="button"
          onClick={() => navigate("/mypage")}
          aria-label="마이페이지"
          className="relative size-[40px] shrink-0"
        >
          <img src={profileIcon} alt="" className="absolute -top-[10px] -left-[10px] max-w-none" />
        </button>
      </div>
      {title && <h1 className="text-display text-black">{title}</h1>}
      {onBack && <TextBackButton onClick={onBack} />}
    </header>
  );
};

export default AppHeader;
