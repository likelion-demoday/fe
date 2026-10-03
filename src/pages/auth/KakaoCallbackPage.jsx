import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { kakaoLogin } from "../../api/auth";

function KakaoCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const isRequested = useRef(false); // 백엔드로 요청 두 번 보내기 방지용
  const code = searchParams.get("code");
  const callbackError = searchParams.get("error") || !code
    ? "카카오 로그인이 취소되었거나 인가 코드를 받지 못했습니다. 다시 시도해주세요."
    : "";
  const displayedError = callbackError || errorMessage;

  useEffect(() => {
    if (callbackError || isRequested.current) return;
    isRequested.current = true;
    const login = async () => {
      try {
        const data = await kakaoLogin(code);

        if (!data?.accessToken || !data?.refreshToken) {
          throw new Error("로그인 응답에 토큰이 없습니다.");
        }
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("isLogin", "true");
        navigate("/home", { replace: true });
      } catch (error) {
        setErrorMessage(error.message || "카카오 로그인에 실패했습니다. 다시 시도해주세요.");
      }
    };
    login();
  }, [code, callbackError, navigate]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-4">
      {displayedError ? (
        <>
          <p role="alert">{displayedError}</p>
          <Link to="/auth/login" replace>로그인 화면으로 돌아가기</Link>
        </>
      ) : "카카오 로그인 처리 중 .."}
    </div>
  );
}
export default KakaoCallbackPage;
