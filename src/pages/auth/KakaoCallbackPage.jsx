import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

function KakaoCallbackPage() {
  const [searchParams] = useSearchParams();
  const isRequested = useRef(false); // 백엔드로 요청 두 번 보내기 방지용

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code || isRequested.current) return;
    isRequested.current = true;

    console.log("카카오 인가 코드: ", code);
    //백엔드 카카오 로그인 API 배포 후 연동
  }, [searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      카카오 로그인 처리 중 ..
    </div>
  );
}
export default KakaoCallbackPage;
