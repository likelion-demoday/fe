import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { payRecording, selectRecordingType } from "../../api/recording";
import { getCreditPrices, getMyCredits } from "../../api/credit";
import { saveChargeReturn } from "../../utils/chargeReturn";
import { savePendingAnalysis } from "../../utils/pendingAnalysis";

import AppHeader from "../../components/common/AppHeader";
import BottomSheet from "../../components/common/BottomSheet";
import TextBackButton from "../../components/common/TextBackButton";
import PurchaseSheet from "../../components/feature/analysis/PurchaseSheet";
import UnpaidLeaveSheet from "../../components/feature/analysis/UnpaidLeaveSheet";
import relationMainIcon from "../../assets/icons/relation-main-m.svg";
import relationLoverIcon from "../../assets/icons/relation-lover-m.svg";
import relationFamilyIcon from "../../assets/icons/relation-family-m.svg";
import purchaseCoinsImage from "../../assets/images/purchase-coins.png";

const COMPLETE_IMAGE = {
  src: purchaseCoinsImage,
  className: "top-[-11.9%] left-[-12.61%] h-[122.73%] w-[122.52%]",
};

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

const RELATIONSHIP_TYPES = {
  daily: { friend: "FRIEND_DAILY", lover: "COUPLE_DAILY" },
  worry: { lover: "COUPLE_CONFLICT", family: "PARENT_CHILD_CONFLICT" },
};

// type → 크레딧 가격 키 (/credits/prices의 analysis)
const PRICE_KEYS = { daily: "daily", worry: "conflict" };

const COMPLETE_SHEET_MS = 1500;

const AnalysisRelation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const config = RELATIONS_BY_TYPE[state?.type];
  const [sheet, setSheet] = useState(null);
  const [selected, setSelected] = useState(null);
  const [ownedCredit, setOwnedCredit] = useState(0);
  const [price, setPrice] = useState(0);
  // 첫 분석 무료 대상이면 잔액과 상관없이 바로 결제 API 호출 (서버가 무료 처리)
  const [isFree, setIsFree] = useState(false);
  const [paying, setPaying] = useState(false);
  // 결제 전 나가기 확인 시트에서 이동할 경로
  const [leaveTo, setLeaveTo] = useState(null);

  useEffect(() => {
    if (!config) return;
    Promise.all([getMyCredits(), getCreditPrices()])
      .then(([credits, prices]) => {
        const free = Boolean(credits.analysisFreeAvailable);
        setOwnedCredit(credits.balance ?? 0);
        setIsFree(free);
        setPrice(free ? 0 : prices.analysis?.[PRICE_KEYS[state.type]] ?? 0);
      })
      .catch((e) => alert(e.message ?? "크레딧 정보를 불러오지 못했어요."));
  }, [config, state?.type]);

  // 결제 후 전사(음성 → 텍스트) 완료까지 로딩 화면에서 대기
  const goToLoading = useCallback(() => {
    navigate("/analysis/loading", {
      replace: true,
      state: { ...state, relation: selected?.id, phase: "transcribing" },
    });
  }, [navigate, state, selected]);

  useEffect(() => {
    if (sheet !== "complete") return;
    const timer = setTimeout(goToLoading, COMPLETE_SHEET_MS);
    return () => clearTimeout(timer);
  }, [sheet, goToLoading]);

  if (!config) return <Navigate to="/analysis/type" replace state={state} />;


  const handleSelect = (relation) => {
    setSelected(relation);
    setSheet("purchase");
  };

  const handlePurchase = async () => {
    if (paying) return;
    const relationshipType = RELATIONSHIP_TYPES[state.type][selected.id];

    setPaying(true);
    try {
      await selectRecordingType(state.recordingId, relationshipType);
      await payRecording(state.recordingId);
      // 구매완료 시트에서 바로 나가도 홈에서 이어할 수 있게 결제 직후 저장 (로딩 화면에서도 다시 저장)
      savePendingAnalysis({ ...state, relation: selected.id, paid: true });
      // 첫 분석 무료면 구매완료 시트 없이 바로 진행
      if (isFree) goToLoading();
      else setSheet("complete");
    } catch (e) {
      alert(e.message ?? "요청에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <main className="relative mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col items-start gap-[30px] overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
      <AppHeader title="대화 분석" onLeave={setLeaveTo} />

      <section className="flex w-full flex-col gap-[24px]">
        <h2 className="text-heading text-[#262626]">대화 상대방과 어떤 사이인가요?</h2>
        <div className={`flex w-full flex-col ${config.gap}`}>
          {config.relations.map(({ id, label, productLabel, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect({ id, label, productLabel })}
              className="flex w-full items-center justify-center gap-[8px] overflow-clip rounded-[16px] border border-[#eee] bg-white px-[42px] py-[50px] shadow-[0px_4px_11.7px_0px_rgba(0,0,0,0.05),0px_0px_49.1px_0px_rgba(0,0,0,0.1)]"
            >
              {RELATION_ICONS[icon]}
              <span className="text-heading whitespace-nowrap text-black">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <TextBackButton onClick={() => navigate(-1)} />

      {sheet === "purchase" && (
        <PurchaseSheet
          productName={`${config.title}_${selected.productLabel}`}
          ownedCredit={ownedCredit}
          price={price}
          freeLabel={isFree ? "첫 분석은 무료예요!" : undefined}
          purchaseText={isFree ? "무료로 분석하기" : undefined}
          onClose={() => setSheet(null)}
          onPurchase={handlePurchase}
          onCharge={() => {
            saveChargeReturn("/analysis/relation", state);
            navigate("/mypage/payments");
          }}
        />
      )}
      {leaveTo && <UnpaidLeaveSheet onStay={() => setLeaveTo(null)} onLeave={() => navigate(leaveTo)} />}
      {sheet === "complete" && <BottomSheet title="구매완료!" image={COMPLETE_IMAGE} onClose={goToLoading} />}
    </main>
  );
};

export default AnalysisRelation;
