import cardBgSmall from "../../../assets/icons/character-card-bg-small.svg";
import cardBgLarge from "../../../assets/icons/character-card-bg-large.svg";
import shadowSmall from "../../../assets/icons/character-shadow-small.svg";
import shadowLarge from "../../../assets/icons/character-shadow-large.svg";
import superEgenImage from "../../../assets/images/character-super-egen.png";
import explainerImage from "../../../assets/images/character-explainer.png";

// 양 옆에 흐리게 보이는 이전/다음 캐릭터 카드
const SideCard = ({ className }) => (
  <div
    className={`absolute h-[160.054px] w-[130px] overflow-clip rounded-[11.183px] border-[0.624px] border-[#eee] shadow-[0px_2.498px_7.306px_0px_rgba(0,0,0,0.05),0px_0px_29.788px_0px_rgba(0,0,0,0.05)] ${className}`}
    style={{ backgroundImage: "linear-gradient(154.64deg, #fff 43.14%, #e2d6e6 87.54%)" }}
    aria-hidden="true"
  >
    <div className="absolute top-[-0.79px] left-[-0.7px] h-[86.667px] w-[133.495px]">
      <img src={cardBgSmall} alt="" className="absolute inset-[-38.47%_-24.97%] block max-w-none" />
    </div>
    <div className="absolute top-0 left-0 flex w-[129.892px] flex-col gap-[4.194px] px-[11.183px] py-[9.785px]">
      <div className="flex w-full items-center justify-between whitespace-nowrap">
        <p className="text-[12.581px] font-bold tracking-[0.5032px] text-[#c8b9cd]">슈퍼에겐 아줌마</p>
        <p className="text-[6.245px] font-medium tracking-[0.1873px] text-[#bfbfbf]">2일전</p>
      </div>
      <p className="text-[9.086px] font-medium tracking-[0.2726px] whitespace-nowrap text-[#595959]">
        상대방의 감정에 집중하고
        <br />
        리액션이 많아요
      </p>
    </div>
    <div className="absolute top-[139.78px] left-[35.65px] h-[10.503px] w-[56.266px]">
      <img src={shadowSmall} alt="" className="absolute inset-[-35.27%_-6.58%] block max-w-none" />
    </div>
    <img
      src={superEgenImage}
      alt=""
      className="pointer-events-none absolute top-[34.25px] left-[37.74px] h-[126.161px] w-[100.965px] max-w-none object-cover"
    />
    <div className="absolute top-[-0.47px] left-[-0.89px] h-[191.207px] w-[134.024px] bg-[rgba(255,255,255,0.3)] backdrop-blur-[1.787px]" />
  </div>
);

const CharacterCarousel = () => {
  return (
    <div className="relative h-[263px] w-full">
      <SideCard className="top-[49px] left-0" />
      <SideCard className="top-[53px] left-[217px]" />

      <article
        className="absolute top-0 left-1/2 h-[229px] w-[186px] -translate-x-1/2 overflow-clip rounded-[16px] border-[0.893px] border-[#eee] shadow-[0px_3.574px_10.454px_0px_rgba(0,0,0,0.05),0px_0px_42.62px_0px_rgba(0,0,0,0.05)]"
        style={{ backgroundImage: "linear-gradient(146.42deg, #fff 40.14%, #c2c5d9 89.39%)" }}
      >
        <div className="absolute top-[-1.12px] left-[-1px] h-[124px] w-[191px]">
          <img src={cardBgLarge} alt="" className="absolute inset-[-38.47%_-24.97%] block max-w-none" />
        </div>
        <div className="absolute top-0 left-0 flex w-[185.846px] flex-col gap-[6px] px-[16px] py-[14px]">
          <div className="flex w-full items-center justify-between whitespace-nowrap">
            <h3 className="text-[16.083px] font-bold tracking-[0.6433px] text-[#3d465d]">설명 보부상</h3>
            <p className="text-[8.935px] font-medium tracking-[0.268px] text-[#bfbfbf]">2일전</p>
          </div>
          <div className="flex w-[95.604px] flex-col gap-[2px] font-medium">
            <p className="text-[8.935px] tracking-[0.268px] text-[#454545]">Mission!</p>
            <p className="text-[11.615px] tracking-[0.3485px] text-[#262626]">
              상대방이 물어본
              <br />
              정보만 이야기해보기
            </p>
          </div>
        </div>
        <div className="absolute top-[198.13px] left-[68.81px] h-[14.819px] w-[79.386px]">
          <img src={shadowLarge} alt="" className="absolute inset-[-35.77%_-6.68%] block max-w-none" />
        </div>
        <img
          src={explainerImage}
          alt="설명 보부상 캐릭터"
          className="pointer-events-none absolute top-[51px] left-[18px] size-[181px] max-w-none object-cover"
        />
      </article>
    </div>
  );
};

export default CharacterCarousel;
