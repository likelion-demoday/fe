import BackButton from "../../common/BackButton";
import profileIcon from "../../../assets/icons/profile.svg";

const MyPageHeader = ({ onBack, title = "마이페이지" }) => {
  return (
    <header className="flex flex-col gap-[20px]">
      <div className="flex h-[40px] items-center justify-between">
        <div className="flex [&_img]:h-auto [&_img]:w-auto">
          <BackButton onClick={onBack} />
        </div>
        <div className="relative size-[40px] shrink-0">
          <img
            src={profileIcon}
            alt="내 프로필"
            className="absolute -top-[10px] -left-[10px] max-w-none"
          />
        </div>
      </div>
      <h1 className="text-display text-black">{title}</h1>
    </header>
  );
};

export default MyPageHeader;
