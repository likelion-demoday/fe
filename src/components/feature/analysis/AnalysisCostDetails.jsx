import dailyIcon from "../../../assets/icons/cost-daily.svg";
import conflictIcon from "../../../assets/icons/cost-conflict.svg";
import familyIcon from "../../../assets/icons/cost-family.svg";
import relationIcon from "../../../assets/icons/relation-main-s.svg";
import divider from "../../../assets/icons/cost-divider.svg";

const GROUPS = [
  { key: "daily", label: "일상 중심", icon: dailyIcon, relations: ["친구 사이", "연인 사이"] },
  { key: "conflict", label: "갈등 중심", icon: conflictIcon, relations: ["연인 사이", "부모 • 자녀 사이"] },
];

const AnalysisCostDetails = ({ prices }) => (
  <div className="flex w-full shrink-0 flex-col gap-[24px] px-[24px] pb-[16px] text-black">
    {GROUPS.map(({ key, label, icon, relations }, index) => (
      <div key={key} className="flex w-full flex-col gap-[24px]">
        {index > 0 && <div className="relative h-0 w-full"><img src={divider} alt="" className="absolute -top-px left-0" /></div>}
        <section aria-label={label} className="flex w-full flex-col items-start gap-[12px]">
          <div className="flex items-end gap-[12px]">
            <h3 className="flex shrink-0 items-center justify-center gap-[3.2px] rounded-[19.2px] bg-white p-[12.8px] text-[20.8px] font-medium tracking-[0.624px] whitespace-nowrap drop-shadow-[0px_3.2px_4.8px_rgba(0,0,0,0.05),0px_0px_9.12px_rgba(0,0,0,0.05)]">
              <img src={icon} alt="" className="shrink-0" />{label}
            </h3>
            <p className="shrink-0 text-[20px] font-semibold tracking-[0.8px] whitespace-nowrap">
              {prices.analysis?.[key] == null ? "확인 불가" : `${prices.analysis[key].toLocaleString()} 크레딧`}
            </p>
          </div>
          <ul className="flex items-center gap-[10px]">
            {relations.map((relation) => (
              <li key={relation} className="text-caption flex shrink-0 items-center justify-center gap-[2px] rounded-[12px] bg-white p-[8px] drop-shadow-[0px_2px_3px_rgba(0,0,0,0.05),0px_0px_5.7px_rgba(0,0,0,0.05)]">
                {relation === "부모 • 자녀 사이" ? <img src={familyIcon} alt="" className="shrink-0" /> : (
                  <span className="relative size-[20px] shrink-0 overflow-hidden">
                    <img src={relationIcon} alt="" className="absolute top-[calc(50%-0.31px)] left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </span>
                )}
                {relation}
              </li>
            ))}
          </ul>
        </section>
      </div>
    ))}
  </div>
);

export default AnalysisCostDetails;
