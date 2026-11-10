import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { login } from "../../api/auth";

import EmailInput from "../../components/feature/auth/EmailInput";
import PasswordInput from "../../components/feature/auth/PasswordInput";
import SocialLoginButtons from "../../components/feature/auth/SocialLoginButtons";
import Button from "../../components/common/Button";
import AppHeader from "../../components/common/AppHeader";
import bubbleTail from "../../assets/icons/bubble-tail.svg";

import { consumeLoginReturn, rememberLoginReturn } from "../../utils/loginReturn";

const Login = () => {
  const { search } = useLocation();
  useEffect(() => {
    rememberLoginReturn(new URLSearchParams(search).get("redirect"));
  }, [search]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await login({ email, password });

      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("isLogin", true);

      // 로그인 화면을 기록에서 지워서 홈에서 뒤로가기로 돌아오지 않게 함
      navigate(consumeLoginReturn(), { replace: true });
    } catch (error) {
      if (error.code === "AUTH401_1") {
        setErrorMessage("이메일 또는 비밀번호가 일치하지 않아요.");
      }
      else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="mx-auto flex h-[min(844px,100dvh)] w-[390px] overflow-y-auto no-scrollbar flex-col items-start gap-[30px] bg-white p-[16px]">
      <AppHeader showProfile={false} />
      <div className="size-[36px] shrink-0" />

      <div className="flex w-full flex-col items-center gap-[80px]">
        <div className="flex w-full flex-col items-start gap-[80px] px-[16px]">
          <h1 className="w-full font-['SUITE',sans-serif] text-[30px] font-bold text-[#2d3038]">
            로그인
          </h1>
          <div className="flex w-full flex-col items-start gap-[56px]">
            <EmailInput
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              onClear={() => {
                setEmail("");
                setErrorMessage("");
              }}
              validate={false}
            />
            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-[12px]">
          <div className="flex w-full flex-col items-center gap-[12px]">
            <div className="flex w-full max-w-[358px] flex-col items-start gap-[4px]">
              {errorMessage && (
                <p className="w-full font-['SUITE',sans-serif] text-[12px] font-medium text-[#ff765b]">
                  {errorMessage}  
                </p>
              )}
              <Button
                text="로그인"
                onClick={handleLogin}
                className="flex w-full items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] font-['SUITE',sans-serif] text-[20px] leading-normal font-semibold tracking-[0.8px] text-white [text-shadow:0px_0px_2px_rgba(0,0,0,0.05)] disabled:bg-[#d9d9d9]"
              />
            </div>
            <div className="flex items-center justify-center gap-[16px]">
              <button
                type="button"
                className="font-['SUITE',sans-serif] text-[13px] font-medium tracking-[0.39px] text-[#595959]"
                onClick={() => navigate("/auth/signup")}
              >
                회원가입
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <SocialLoginButtons />
            <div className="relative flex items-center justify-center rounded-[12px] bg-white p-[10px] [filter:drop-shadow(0px_2px_5.85px_rgba(0,0,0,0.1))_drop-shadow(0px_0px_24.55px_rgba(0,0,0,0.1))]">
              <img
                src={bubbleTail}
                alt=""
                width="18.1865"
                height="15.75"
                className="absolute top-[-11px] left-[calc(50%-0.5px)] block max-w-none -translate-x-1/2"
              />
              <p className="relative font-['SUITE',sans-serif] text-[16px] leading-normal font-medium tracking-[0.32px] whitespace-nowrap text-black">
                소셜 로그인시 분석 1회 무료!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
