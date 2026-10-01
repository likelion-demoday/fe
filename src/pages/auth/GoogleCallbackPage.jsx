import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { googleLogin } from "../../api/auth";

function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const isRequested = useRef(false); // 백엔드로 요청 두 번 보내기 방지용

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code || isRequested.current) return;
    isRequested.current = true;

    const state = searchParams.get("state");
    const expectedState = sessionStorage.getItem("googleOAuthState");
    if (!state || state !== expectedState) {
      console.error("구글 로그인 실패: 로그인 요청 정보가 일치하지 않습니다.");
      return;
    }
    sessionStorage.removeItem("googleOAuthState");

    const login = async () => {
      try {
        await googleLogin(code);
        console.log("구글 로그인 성공");
      } catch (error) {
        console.error("구글 로그인 실패:", error);
      }
    };
    login();
  }, [searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      구글 로그인 처리 중 ..
    </div>
  );
}

export default GoogleCallbackPage;
