const CreditBalance = ({ balance = 12480 }) => (
  <section className="flex w-full flex-col gap-[8px] rounded-[16px] bg-white px-[24px] py-[30px] shadow-[0_4px_11.7px_rgba(0,0,0,0.05),0_0_47.7px_rgba(0,0,0,0.1)]">
    <p className="text-caption text-[#595959]">보유 크레딧</p>
    <p className="text-heading text-[#ff765b]">
      {balance.toLocaleString("ko-KR")}크레딧
    </p>
  </section>
);

export default CreditBalance;
