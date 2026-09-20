import { useState } from "react";

import EmailInput from "../../components/feature/auth/EmailInput";
import PasswordInput from "../../components/feature/auth/PasswordInput";
import SocialLoginButtons from "../../components/feature/auth/SocialLoginButtons";
import Button from "../../components/common/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("로그인 버튼 클릭");
  };

  return (
    <div className="flex min-h-screen flex-col items-start gap-[30px] bg-white p-[16px]">
      <div className="size-[36px] shrink-0" />

      <div className="flex w-full flex-col items-center gap-[80px]">
        <div className="flex w-full flex-col items-start gap-[80px] px-[16px]">
          <h1 className="w-full font-['SUITE',sans-serif] text-[30px] font-bold text-[#2d3038]">
            로그인
          </h1>
          <div className="flex w-full flex-col items-start gap-[56px]">
            <EmailInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onClear={() => setEmail("")}
            />
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-[12px]">
          <div className="flex w-full flex-col items-center gap-[12px]">
            <Button
              text="로그인"
              onClick={handleLogin}
              className="flex h-[49px] w-full max-w-[358px] items-center justify-center rounded-[12px] bg-[#454545] px-[26px] py-[14px] font-['Pretendard',sans-serif] text-[18px] font-semibold tracking-[-0.36px] text-white"
            />
            <div className="flex items-center justify-center gap-[16px]">
              <button
                type="button"
                className="font-['SUITE',sans-serif] text-[13px] font-medium tracking-[0.39px] text-[#595959]"
              >
                계정 찾기
              </button>
              <span className="h-[22px] w-px bg-[#dfe2ea]" />
              <button
                type="button"
                className="font-['SUITE',sans-serif] text-[13px] font-medium tracking-[0.39px] text-[#595959]"
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
