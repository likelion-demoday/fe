import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import { checkEmail } from "../../api/auth";

import EmailInput from "../../components/feature/auth/EmailInput";
import PasswordInput from "../../components/feature/auth/PasswordInput";
import SocialLoginButtons from "../../components/feature/auth/SocialLoginButtons";
import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import { isValidEmail } from "../../utils/validation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 회원가입 버튼을 눌렀을 때 중복 확인 결과. 이메일을 고치면 초기화
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [checking, setChecking] = useState(false);
  const isPasswordValid = password.length >= 8;
  const isFormValid = isValidEmail(email) && isPasswordValid && !isEmailTaken;

  const navigate = useNavigate();

  const setSignupData = useAuthStore((state) => state.setAuthData);

  const handleBack = () => {
    navigate(-1);
  };

  const changeEmail = (value) => {
    setEmail(value);
    setIsEmailTaken(false);
  };

  const handleSignUp = async () => {
    if (checking) return;
    setChecking(true);
    try {
      const { available } = await checkEmail(email);
      if (!available) {
        setIsEmailTaken(true);
        return;
      }
      setSignupData({ email, password, registerToken: "" });
      navigate("/onboarding/nickname");
    } catch (error) {
      alert(error.message ?? "이메일을 확인하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="mx-auto flex h-[844px] w-[390px] overflow-y-auto no-scrollbar flex-col items-start gap-[30px] bg-white p-[16px]">
      <BackButton onClick={handleBack} />

      <div className="flex w-full flex-col items-center gap-[80px]">
        <div className="flex w-full flex-col items-start gap-[80px] px-[16px]">
          <h1 className="w-full font-['SUITE',sans-serif] text-[30px] font-bold text-[#2d3038]">
            회원가입
          </h1>
          <div className="flex w-full flex-col items-start gap-[56px]">
            <EmailInput
              value={email}
              onChange={(e) => changeEmail(e.target.value)}
              onClear={() => changeEmail("")}
              error={isEmailTaken}
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
            disabled={!isFormValid || checking}
            className="flex h-[49px] w-[358px] items-center justify-center rounded-[12px] bg-[#262626] px-[26px] py-[14px] font-['Pretendard',sans-serif] text-[18px] font-semibold tracking-[-0.36px] text-white disabled:bg-[#d9d9d9]"
          />
          <SocialLoginButtons />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
