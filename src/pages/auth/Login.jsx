import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../api/auth";

import EmailInput from "../../components/feature/auth/EmailInput";
import PasswordInput from "../../components/feature/auth/PasswordInput";
import SocialLoginButtons from "../../components/feature/auth/SocialLoginButtons";
import Button from "../../components/common/Button";

const Login = () => {
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

      navigate("/home");
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
    <div className="mx-auto flex h-[844px] w-[390px] overflow-y-auto no-scrollbar flex-col items-start gap-[30px] bg-white p-[16px]">
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
                className="flex h-[49px] w-full items-center justify-center rounded-[12px] bg-[#262626] px-[26px] py-[14px] font-['Pretendard',sans-serif] text-[18px] font-semibold tracking-[-0.36px] text-white disabled:bg-[#d9d9d9]"
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
          <SocialLoginButtons />
        </div>
      </div>
    </div>
  );
};

export default Login;
