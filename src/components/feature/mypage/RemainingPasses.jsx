const RemainingPasses = ({ count = 3 }) => {
  return (
    <div className="text-label flex w-full items-center justify-between py-[12px] text-[#262626]">
      <p>남은 개인 분석 이용권</p>
      <p className="shrink-0">{count}개</p>
    </div>
  );
};

export default RemainingPasses;
