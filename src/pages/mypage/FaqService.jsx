import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";

const QUESTIONS = [
  {
    question: "RE:SAY는 어떤 서비스인가요?",
    answer: "RE:SAY는 친구·연인·부모자녀가 나눈 대화를 녹음하거나 업로드하면 CLOVA 음성 인식, LINER 대화 분석, OpenAI 캐릭터 생성 기능을 이용해 대화 보고서를 보여주는 모바일 웹 서비스입니다.",
  },
  {
    question: "어떤 대화를 분석할 수 있나요?",
    answer: "친구·연인·부모자녀의 일상 및 갈등 대화, 총 6가지 유형을 제공합니다. 일상 중심 분석에는 1,500크레딧, 갈등 중심 분석에는 2,000크레딧이 사용됩니다.",
  },
  {
    question: "분석 결과는 얼마나 정확한가요?",
    answer: "AI 분석 결과는 음질과 화자 분리, 대화 맥락에 따라 오류가 있을 수 있습니다. 관심도·표독력 등의 지표는 해당 대화에 나타난 표현의 참고 분석이지 실제 성격·감정을 판단하는 점수가 아닙니다.",
  },
  {
    question: "보고서는 어디에서 다시 확인하나요?",
    answer: "분석이 완료되면 마이페이지 → 보고서 보관함에서 확인할 수 있습니다. 보고서의 보존 기간은 [확정 필요]입니다.",
  },
  {
    question: "상대방에게 보고서를 공유할 수 있나요?",
    answer: "네. 결과 보고서를 공유할 수 있습니다. 다만 공유 이미지에 닉네임과 점수가 들어갈 수 있으니 공개할 정보를 확인하고 상대방의 권리를 존중해 주세요.",
  },
];

const FaqService = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white">
      <div className="shrink-0 px-[24px] py-[16px]">
        <MyPageHeader title="서비스 이용" onBack={() => navigate("/mypage/support/faq")} />
      </div>
      <div className="mt-[20px] flex shrink-0 flex-col gap-[19px] px-[24px] pb-[42px] font-['Noto_Sans_KR',sans-serif] leading-[1.58]">
        <p className="text-[13px] font-normal text-[#787878]">서비스 기능을 시작하기 전에 확인할 질문들이에요.</p>
        {QUESTIONS.map(({ question, answer }, index) => (
          <section
            key={question}
            id={`question-${index + 1}`}
            aria-labelledby={`question-title-${index + 1}`}
            className="flex scroll-mt-[19px] flex-col gap-[7px] border-t border-[#f1eceb] pt-[19px]"
          >
            <h2 id={`question-title-${index + 1}`} className="text-[14px] font-bold text-[#262626]">Q. {question}</h2>
            <p className="text-[12.6px] font-normal text-[#787878]">{answer}</p>
          </section>
        ))}
        <aside className="rounded-[12px] bg-[#fff1ef] p-[13px] text-[12px] font-normal text-[#787878]">
          다른 질문이 있나요? 고객지원 → 문의하기에서 구체적인 상황을 남겨주세요.
        </aside>
      </div>
    </main>
  );
};

export default FaqService;
