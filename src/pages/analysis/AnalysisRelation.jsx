import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import AppHeader from "../../components/common/AppHeader";
import BottomSheet from "../../components/common/BottomSheet";
import PurchaseSheet from "../../components/feature/analysis/PurchaseSheet";
import chevronLeftIcon from "../../assets/icons/chevron-left.svg";
import relationMainIcon from "../../assets/icons/relation-main-m.svg";
import relationLoverIcon from "../../assets/icons/relation-lover-m.svg";
import relationFamilyIcon from "../../assets/icons/relation-family-m.svg";

const RELATION_ICONS = {
  main: (
    <span className="relative size-[32px] shrink-0 overflow-clip">
      <img
        src={relationMainIcon}
        alt=""
        className="absolute top-[calc(50%-0.5px)] left-1/2 block h-[25px] w-[22px] max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </span>
  ),
  lover: <img src={relationLoverIcon} alt="" className="block size-[32px] max-w-none shrink-0" />,
  family: <img src={relationFamilyIcon} alt="" className="block size-[32px] max-w-none shrink-0" />,
};


const RELATIONS_BY_TYPE = {
  daily: {
    title: "일상 중심",
    gap: "gap-[36px]",
    relations: [
      { id: "friend", label: "친구 사이", productLabel: "친구사이", icon: "main" },
      { id: "lover", label: "연인 사이", productLabel: "연인사이", icon: "lover" },
    ],
  },
  worry: {
    title: "갈등 중심",
    gap: "gap-[24px]",
    relations: [
      { id: "lover", label: "연인 사이", productLabel: "연인사이", icon: "lover" },
      { id: "family", label: "부모 • 자녀 사이", productLabel: "부모자녀사이", icon: "family" },
    ],
  },
};

const COMPLETE_SHEET_MS = 1500;

const AnalysisRelation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const config = RELATIONS_BY_TYPE[state?.type];
  // null | "purchase"(구매하기) | "complete"(구매완료)
  const [sheet, setSheet] = useState(null);
  const [selected, setSelected] = useState(null);

  const goToLoading = useCallback(() => {
    // TODO: 분석 요청 API 연동
    navigate("/analysis/loading", {
      replace: true,
      state: { ...state, relation: selected?.id },
    });
  }, [navigate, state, selected]);

  useEffect(() => {
    if (sheet !== "complete") return;
    const timer = setTimeout(goToLoading, COMPLETE_SHEET_MS);
    return () => clearTimeout(timer);
  }, [sheet, goToLoading]);

  if (!config) return <Navigate to="/analysis/type" replace state={state} />;


  const ownedCredit = 2000;
  const price = 1300;

  const handleSelect = (relation) => {
    setSelected(relation);
    setSheet("purchase");
  };

  const handlePurchase = () => {
    console.log("분석 구매", { ...state, relation: selected.id, price });
    setSheet("complete");
  };

  return (
    <main className="relative mx-auto flex h-[844px] w-[390px] flex-col items-start gap-[30px] overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
      <AppHeader title="대화 분석" />

      <section className="flex w-full flex-col gap-[24px]">
        <h2 className="text-heading text-[#262626]">대화 상대방과 어떤 사이인가요?</h2>
        <div className={`flex w-full flex-col ${config.gap}`}>
          {config.relations.map(({ id, label, productLabel, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect({ id, label, productLabel })}
              className="flex w-full items-center justify-center gap-[8px] overflow-clip rounded-[16px] border border-[#eee] bg-white px-[42px] py-[50px] shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_47.7px_0px_rgba(0,0,0,0.1)]"
            >
              {RELATION_ICONS[icon]}
              <span className="text-heading whitespace-nowrap text-black">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center justify-center gap-[8px] rounded-[6px]"
      >
        <img src={chevronLeftIcon} alt="" className="block h-[13px] w-[8px] max-w-none shrink-0" />
        <span className="text-body whitespace-nowrap text-[#595959]">뒤로가기</span>
      </button>

      {sheet === "purchase" && (
        <PurchaseSheet
          productName={`${config.title}_${selected.productLabel}`}
          ownedCredit={ownedCredit}
          price={price}
          onClose={() => setSheet(null)}
          onPurchase={handlePurchase}
        />
      )}
      {sheet === "complete" && <BottomSheet title="구매완료!" onClose={goToLoading} />}
    </main>
  );
};

export default AnalysisRelation;
