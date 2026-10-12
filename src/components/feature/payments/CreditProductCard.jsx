import Button from "../../common/Button";

const CreditProductCard = ({ credits, price, selected = false, onClick }) => (
  <Button
    onClick={onClick}
    className="flex w-full cursor-pointer flex-col items-start gap-[5px] rounded-[16px] border border-[#eeeeee] bg-white px-[18px] py-[13px] text-left shadow-[0_2px_6px_rgba(0,0,0,0.05),0_0_11.4px_rgba(0,0,0,0.05)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff765b]"
    text={
      <>
        <span
          className={`text-title-semibold w-full ${selected ? "text-[#ff765b]" : "text-black"}`}
        >
          {credits.toLocaleString("ko-KR")}크레딧
        </span>
        <span
          className={`text-caption w-full ${selected ? "text-[#ff8d77]" : "text-[#595959]"}`}
        >
          {price.toLocaleString("ko-KR")}원
        </span>
      </>
    }
  />
);

export default CreditProductCard;
