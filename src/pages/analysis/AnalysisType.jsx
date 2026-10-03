import { useLocation, useNavigate } from "react-router-dom";

import AppHeader from "../../components/common/AppHeader";
import dailyIcon from "../../assets/icons/analysis-type-daily.svg";
import worryIcon from "../../assets/icons/analysis-type-worry.svg";
import relationMainIcon from "../../assets/icons/relation-main-s.svg";
import relationLoverIcon from "../../assets/icons/relation-lover-s.svg";

const RELATION_ICONS = {
  main: (
    <span className="relative size-[20px] shrink-0 overflow-clip">
      <img
        src={relationMainIcon}
        alt=""
        className="absolute top-[calc(50%-0.31px)] left-1/2 block h-[15.625px] w-[13.75px] max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </span>
  ),
  lover: <img src={relationLoverIcon} alt="" className="block size-[20px] max-w-none shrink-0" />,
};

const ANALYSIS_TYPES = [
  {
    id: "daily",
    icon: dailyIcon,
    title: "일상 중심",
    description: ["둘만의 대화 스타일을", "유쾌하고 가볍게 알아봐요"],
    relations: [
      { label: "친구 사이", icon: "main" },
      { label: "연인 사이", icon: "lover" },
    ],
  },
  {
    id: "worry",
    icon: worryIcon,
    title: "갈등 중심",
    description: ["둘 사이에 엇갈린 부분을", "차분하고 깊게 들여다봐요"],
    relations: [
      { label: "연인 사이", icon: "main" },
      { label: "부모 • 자녀 사이", icon: "lover" },
    ],
  },
];

const AnalysisType = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleSelect = (type) => {
    navigate("/analysis/relation", { state: { ...state, type } });
  };

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[30px] overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
      <AppHeader title="대화 분석" />

      <section className="flex w-full flex-col gap-[24px]">
        <h2 className="text-heading text-[#262626]">어떤 유형으로 분석할까요?</h2>
        <div className="flex w-full flex-col gap-[36px]">
          {ANALYSIS_TYPES.map(({ id, icon, title, description, relations }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              className="flex w-full flex-col items-start gap-[30px] overflow-clip rounded-[16px] border border-[#eee] bg-white px-[24px] pt-[24px] pb-[28px] text-left shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]"
            >
              <div className="flex flex-col items-start gap-[8px]">
                <div className="flex items-center gap-[6px]">
                  <img src={icon} alt="" className="block size-[32px] max-w-none shrink-0" />
                  <h3 className="text-heading whitespace-nowrap text-black">{title}</h3>
                </div>
                <p className="text-body whitespace-nowrap text-black">
                  {description[0]}
                  <br />
                  {description[1]}
                </p>
              </div>
              <ul className="flex items-start gap-[8px]">
                {relations.map(({ label, icon: relationIcon }) => (
                  <li
                    key={label}
                    className="flex items-center justify-center gap-[2px] rounded-[12px] bg-white p-[8px] drop-shadow-[0px_2px_3px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_5.7px_rgba(0,0,0,0.05)]"
                  >
                    {RELATION_ICONS[relationIcon]}
                    <span className="text-caption whitespace-nowrap text-black">{label}</span>
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AnalysisType;
