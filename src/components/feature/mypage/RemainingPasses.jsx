const RemainingPasses = ({ balance }) => {
  return (
    <div className="text-label flex w-full items-center justify-between py-[12px] text-[#262626]">
      <p>남은 크레딧</p>
      <p className="shrink-0">{balance.toLocaleString("ko-KR")}</p>
    </div>
  );
};

export default RemainingPasses;
