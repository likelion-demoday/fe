import { useState } from "react";

import EmailInput from "../../components/feature/auth/EmailInput";
import PasswordInput from "../../components/feature/auth/PasswordInput";
import SocialLoginButtons from "../../components/feature/auth/SocialLoginButtons";
import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleBack = () => {
    console.log("뒤로가기 버튼 클릭");
  };

  const handleSignUp = () => {
    console.log("회원가입 버튼 클릭");
  };

  return (
    <div className="flex min-h-screen flex-col items-start gap-[30px] bg-white p-[16px]">
      <BackButton onClick={handleBack} />

      <div className="flex w-full flex-col items-center gap-[80px]">
        <div className="flex w-full flex-col items-start gap-[80px] px-[16px]">
          <h1 className="w-full font-['SUITE',sans-serif] text-[30px] font-bold text-[#2d3038]">
            회원가입
          </h1>
          <div className="flex w-full flex-col items-start gap-[56px]">
            <EmailInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onClear={() => setEmail("")}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-[10px]">
          <Button
            text="회원가입"
            onClick={handleSignUp}
            className="flex h-[49px] w-full max-w-[358px] items-center justify-center rounded-[12px] bg-[#454545] px-[26px] py-[14px] font-['Pretendard',sans-serif] text-[18px] font-semibold tracking-[-0.36px] text-white"
          />
          <SocialLoginButtons />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
