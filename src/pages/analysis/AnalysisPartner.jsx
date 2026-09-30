import { useNavigate } from "react-router-dom";

import AppHeader from "../../components/common/AppHeader";
import ActionCard from "../../components/feature/analysis/ActionCard";
import loverHeartIcon from "../../assets/icons/partner-lover-heart.svg";
import familyIcon from "../../assets/icons/partner-family.svg";

// 심볼: Paperlogy SemiBold의 ":S"를 90도 회전한 형태
const SymbolMark = () => (
  <div className="absolute top-[5.52px] left-[2.86px] flex h-[27px] w-[33px] items-center justify-center">
    <p className="rotate-90 font-['Paperlogy',sans-serif] text-[28.291px] leading-normal font-semibold tracking-[1.4146px] whitespace-nowrap text-[#ff765b]">
      :S
    </p>
  </div>
);

const PARTNER_ICONS = {
  friend: <SymbolMark />,
  lover: (
    <>
      <SymbolMark />
      <div className="absolute top-[8.76%] bottom-[78.1%] left-[calc(50%-0.14px)] w-[5.517px] -translate-x-1/2">
        <img src={loverHeartIcon} alt="" className="absolute inset-[-8.33%_-7.5%] block max-w-none" />
      </div>
    </>
  ),
  family: (
    <div className="absolute inset-[19.71%_24.46%_19.71%_23.74%]">
      <img src={familyIcon} alt="" className="absolute inset-[0_-7.64%_-7.57%_-8.34%] block max-w-none" />
    </div>
  ),
};

const PARTNERS = [
  { id: "friend", label: "친구와의 대화" },
  { id: "lover", label: "연인과의 대화" },
  { id: "family", label: "자녀와의 대화" },
];

const AnalysisPartner = () => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[30px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <AppHeader title="대화 분석" />

      <section className="flex w-full flex-col gap-[20px]">
        <h2 className="text-heading text-[#262626]">누구와 대화를 나눌건가요?</h2>
        <div className="flex w-full flex-col gap-[24px]">
          {PARTNERS.map(({ id, label }) => (
            <ActionCard
              key={id}
              icon={<div className="relative h-[37.793px] w-[38.345px] shrink-0">{PARTNER_ICONS[id]}</div>}
              label={label}
              onClick={() => navigate("/analysis/record", { state: { partner: id } })}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default AnalysisPartner;
