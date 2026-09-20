import GoogleIcon from "../../common/icons/GoogleIcon";
import kakaoIcon from "../../../assets/icons/kakao.svg";

const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const SocialLoginButtons = ({onGoogleClick}) => {
  const onKakaoClick = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="flex items-start gap-[16px] px-[16px] py-[10px]">
      <button
        type="button"
        onClick={onKakaoClick}
        aria-label="카카오로 계속하기"
        className="relative size-[40px] shrink-0"
      >
        <img
          src={kakaoIcon}
          alt=""
          className="absolute inset-0 block size-full max-w-none"
        />
      </button>
      <button
        type="button"
        onClick={onGoogleClick}
        aria-label="구글로 계속하기"
      >
        <GoogleIcon />
      </button>
    </div>
  );
};

export default SocialLoginButtons;
