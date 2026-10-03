import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { googleLogin } from "../../api/auth";

function GoogleCallbackPage() {
  const { hash } = useLocation();
  const searchParams = new URLSearchParams(hash.slice(1));
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const isRequested = useRef(false); // 백엔드로 요청 두 번 보내기 방지용
  const [expectedState] = useState(() => sessionStorage.getItem("googleOAuthState"));
  const [expectedNonce] = useState(() => sessionStorage.getItem("googleOAuthNonce"));
  const idToken = searchParams.get("id_token");
  const state = searchParams.get("state");
  const callbackError = searchParams.get("error") || !idToken
    ? "구글 로그인이 취소되었거나 ID 토큰을 받지 못했습니다. 다시 시도해주세요."
    : !state || state !== expectedState
      ? "로그인 요청 정보가 일치하지 않습니다. 로그인 화면에서 다시 시도해주세요."
      : "";
  const displayedError = callbackError || errorMessage;

  useEffect(() => {
    if (isRequested.current) return;
    isRequested.current = true;
    sessionStorage.removeItem("googleOAuthState");
    sessionStorage.removeItem("googleOAuthNonce");
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    if (callbackError) return;

    const login = async () => {
      try {
        // 서명 검증은 백엔드에서 수행하고, 여기서는 로그인 요청의 nonce를 확인합니다.
        const payload = idToken.split(".")[1];
        const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
        const bytes = Uint8Array.from(atob(normalizedPayload), (char) => char.charCodeAt(0));
        const claims = JSON.parse(new TextDecoder().decode(bytes));
        if (!expectedNonce || claims.nonce !== expectedNonce) {
          throw new Error("로그인 요청 정보가 일치하지 않습니다. 로그인 화면에서 다시 시도해주세요.");
        }
        const data = await googleLogin(idToken);
        if (!data?.accessToken || !data?.refreshToken) {
          throw new Error("로그인 응답에 토큰이 없습니다.");
        }
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("isLogin", "true");
        navigate("/home", { replace: true });
      } catch (error) {
        setErrorMessage(error.message || "구글 로그인에 실패했습니다. 다시 시도해주세요.");
      }
    };
    login();
  }, [idToken, expectedNonce, callbackError, navigate]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-4">
      {displayedError ? (
        <>
          <p role="alert">{displayedError}</p>
          <Link to="/auth/login" replace>로그인 화면으로 돌아가기</Link>
        </>
      ) : "구글 로그인 처리 중 .."}
    </div>
  );
}

export default GoogleCallbackPage;
