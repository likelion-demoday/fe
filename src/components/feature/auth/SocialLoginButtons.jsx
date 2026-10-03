import GoogleIcon from "../../common/icons/GoogleIcon";
import kakaoIcon from "../../../assets/icons/kakao.svg";

const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
  client_id: GOOGLE_CLIENT_ID,
  redirect_uri: GOOGLE_REDIRECT_URI,
  response_type: "id_token",
  scope: "openid email profile",
})}`;

const SocialLoginButtons = () => {
  const onKakaoClick = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const onGoogleClick = () => {
    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID();
    sessionStorage.setItem("googleOAuthState", state);
    sessionStorage.setItem("googleOAuthNonce", nonce);
    window.location.href = `${GOOGLE_AUTH_URL}&${new URLSearchParams({ state, nonce })}`;
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
