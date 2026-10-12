import Button from "../../common/Button";
import character from "../../../assets/images/credit-charge-result.png";

const CreditChargeResult = ({ title, buttonText, onClick }) => (
  <main className="relative mx-auto flex min-h-[844px] w-full max-w-[390px] flex-col bg-white">
    <section className="absolute top-[calc(50%+0.5px)] left-[16px] flex w-[calc(100%-48px)] -translate-y-1/2 flex-col items-center gap-[10px]">
      <h1 className="text-display w-full text-center text-black">{title}</h1>
      <div className="relative size-[136px] shrink-0 overflow-hidden">
        <img
          src={character}
          alt=""
          className="absolute -top-[4.41%] -left-[4.41%] size-[108.82%] max-w-none"
        />
      </div>
    </section>
    <footer className="mt-auto bg-gradient-to-b from-transparent to-white to-[15.614%] px-[24px] pt-[20px] pb-[30px]">
      <Button
        text={buttonText}
        onClick={onClick}
        className="flex w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#262626] px-[26px] py-[16px] text-[20px] leading-[normal] font-semibold tracking-[0.04em] text-white text-shadow-[0_0_2px_rgba(0,0,0,0.05)]"
      />
    </footer>
  </main>
);

export default CreditChargeResult;
