import GoogleIcon from "../../common/icons/GoogleIcon";
import kakaoIcon from "../../../assets/icons/kakao.svg";

const SocialLoginButtons = ({ onKakaoClick, onGoogleClick }) => {
  return (
    <div className="flex items-start gap-[16px] px-[16px] py-[10px]">
      <button
        type="button"
        onClick={onKakaoClick}
        aria-label="카카오로 계속하기"
        className="relative size-[40px] shrink-0"
      >
        <img src={kakaoIcon} alt="" className="absolute inset-0 block size-full max-w-none" />
      </button>
      <button type="button" onClick={onGoogleClick} aria-label="구글로 계속하기">
        <GoogleIcon />
      </button>
    </div>
  );
};

export default SocialLoginButtons;
