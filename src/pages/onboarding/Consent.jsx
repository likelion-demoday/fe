import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import circleIcon from "../../assets/icons/check-circle.svg";
import chevronRightIcon from "../../assets/icons/chevron-right.svg";
import dividerIcon from "../../assets/icons/divider.svg";

const AGREEMENTS = [
  { id: "terms", label: "[필수] 서비스 이용약관 동의", required: true },
  { id: "privacy", label: "[필수] 개인정보 수집 • 이용 동의", required: true },
  { id: "voice", label: "[필수] 음성정보 처리 동의", required: true },
  { id: "marketing", label: "[선택] 마케팅 정보 수신 동의", required: false },
];


const CheckCircle = ({ checked }) => {
  if (checked) {
    return <span className="size-[20px] shrink-0 rounded-full bg-[#454545]" />;
  }
  return (
    <span className="relative size-[20px] shrink-0">
      <img src={circleIcon} alt="" className="absolute inset-0 block size-full max-w-none" />
    </span>
  );
};

const Divider = () => (
  <img src={dividerIcon} alt="" className="block h-px w-full max-w-none shrink-0" />
);

const Consent = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState({});

  const allChecked = AGREEMENTS.every(({ id }) => checked[id]);
  const requiredChecked = AGREEMENTS.filter(({ required }) => required).every(
    ({ id }) => checked[id],
  );

  const toggle = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(Object.fromEntries(AGREEMENTS.map(({ id }) => [id, next])));
  };

  const handleBack = () => {
    console.log("뒤로가기 버튼 클릭");
    navigate(-1);
  };

  const handleNext = () => {
    console.log("다음 버튼 클릭", checked);
    navigate("/home");
  };

  const handleView = (id) => {
    console.log("약관 보기", id);
  };

  return (
    <div className="flex min-h-screen flex-col items-start justify-between bg-white">
      {/* 상단 영역 (기본 마진 16) */}
      <div className="flex w-full flex-col items-center gap-[80px] p-[16px]">
        <div className="flex w-full flex-col items-start">
          <BackButton onClick={handleBack} />
        </div>

        <div className="flex w-full flex-col items-start gap-[60px] px-[16px]">
          <h1 className="font-['SUITE',sans-serif] text-[24px] font-bold whitespace-nowrap text-black">
            <span className="block leading-normal">서비스 이용을 위해</span>
            <span className="block leading-normal">아래의 정보 활용에 동의해주세요</span>
          </h1>

          <div className="flex w-full flex-col items-start gap-[16px]">
            <button
              type="button"
              onClick={toggleAll}
              aria-pressed={allChecked}
              className="flex items-center gap-[12px]"
            >
              <CheckCircle checked={allChecked} />
              <span className="font-['SUITE',sans-serif] text-[18px] font-semibold tracking-[0.72px] whitespace-nowrap text-[#262626]">
                전체 동의
              </span>
            </button>

            {AGREEMENTS.map(({ id, label }, index) => (
              <div key={id} className="contents">
                {index === 0 && <Divider />}
                <div className="flex w-full items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggle(id)}
                    aria-pressed={Boolean(checked[id])}
                    className="flex items-center gap-[12px]"
                  >
                    <CheckCircle checked={Boolean(checked[id])} />
                    <span className="font-['SUITE',sans-serif] text-[16px] font-semibold whitespace-nowrap text-[#262626]">
                      {label}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleView(id)}
                    className="flex items-center justify-center gap-[2px] rounded-[6px] px-[6px]"
                  >
                    <span className="font-['SUITE',sans-serif] text-[13px] font-medium tracking-[0.39px] whitespace-nowrap text-[#8c8c8c]">
                      보기
                    </span>
                    <img
                      src={chevronRightIcon}
                      alt=""
                      className="block h-[11px] w-[7px] max-w-none shrink-0"
                    />
                  </button>
                </div>
                {index < AGREEMENTS.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-[24px] px-[16px] pt-[10px] pb-[30px]">
        <div className="flex items-center justify-center gap-[12px]">
          <span className="size-[8px] rounded-[99px] bg-[#454545]" />
          <span className="size-[8px] rounded-[99px] bg-[#454545]" />
          <span className="size-[8px] rounded-[99px] bg-[#454545]" />
        </div>
        <Button
          text="다음"
          onClick={handleNext}
          disabled={!requiredChecked}
          className="flex h-[49px] w-full max-w-[358px] items-center justify-center rounded-[12px] bg-[#454545] px-[26px] py-[14px] font-['Pretendard',sans-serif] text-[18px] font-semibold tracking-[-0.36px] text-white disabled:bg-[#d9d9d9]"
        />
      </div>
    </div>
  );
};

export default Consent;
