import { useState } from "react";

import TextField from "../../components/common/TextField";
import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import clearIcon from "../../assets/icons/clear.svg";

const MIN_LENGTH = 2;
const MAX_LENGTH = 8;

const Nickname = () => {
  const [nickname, setNickname] = useState("");

  const isValid = nickname.length >= MIN_LENGTH && nickname.length <= MAX_LENGTH;

  const handleBack = () => {
    console.log("뒤로가기 버튼 클릭");
  };

  const handleNext = () => {
    console.log("다음 버튼 클릭", nickname);
  };

  return (
    <div className="flex min-h-screen flex-col items-start justify-between bg-white">
      {/* 상단 영역 (기본 마진 16) */}
      <div className="flex w-full flex-col items-center gap-[80px] p-[16px]">
        <div className="flex w-full flex-col items-start">
          <BackButton onClick={handleBack} />
        </div>

        <div className="flex w-full flex-col items-start gap-[60px] px-[16px]">
          <div className="flex flex-col items-start gap-[6px] whitespace-nowrap">
            <h1 className="font-['SUITE',sans-serif] text-[24px] font-bold text-black">
              <span className="block leading-normal">반가워요!</span>
              <span className="block leading-normal">앞으로 사용할 닉네임을 알려주세요</span>
            </h1>
            <p className="font-['SUITE',sans-serif] text-[13px] font-medium tracking-[0.39px] text-[#787e8c]">
              설정에서 변경할 수 있어요
            </p>
          </div>

          <TextField
            id="nickname"
            label="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요."
            helperText={`${MIN_LENGTH}~${MAX_LENGTH}자로 입력해주세요.`}
            maxLength={MAX_LENGTH}
            trailing={
              nickname ? (
                <button
                  type="button"
                  onClick={() => setNickname("")}
                  aria-label="닉네임 지우기"
                  className="relative size-[16px] shrink-0 overflow-clip"
                >
                  <img src={clearIcon} alt="" className="block size-full max-w-none" />
                </button>
              ) : null
            }
          />
        </div>
      </div>

      {/* 하단 영역 (아래 마진 30 고정) */}
      <div className="flex w-full flex-col items-center justify-center gap-[24px] px-[16px] pt-[10px] pb-[30px]">
        <div className="flex items-center justify-center gap-[12px]">
          <span className="size-[8px] rounded-[99px] bg-[#454545]" />
          <span className="size-[8px] rounded-[99px] bg-[#d9d9d9]" />
          <span className="size-[8px] rounded-[99px] bg-[#d9d9d9]" />
        </div>
        <Button
          text="다음"
          onClick={handleNext}
          disabled={!isValid}
          className="flex h-[49px] w-full max-w-[358px] items-center justify-center rounded-[12px] bg-[#454545] px-[26px] py-[14px] font-['Pretendard',sans-serif] text-[18px] font-semibold tracking-[-0.36px] text-white disabled:bg-[#d9d9d9]"
        />
      </div>
    </div>
  );
};

export default Nickname;
