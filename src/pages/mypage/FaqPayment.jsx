import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";

const QUESTIONS = [
  {
    "question": "크레딧은 어떻게 사용하나요?",
    "answer": "친구·연인·부모자녀 모두 일상 중심 분석은 1,500크레딧, 갈등 중심 분석은 2,000크레딧을 사용합니다. 유료 크레딧의 유효기간은 구매일로부터 1년입니다."
  },
  {
    "question": "결제했는데 크레딧이 지급되지 않았어요.",
    "answer": "NICEPAY 결제 후 보유 크레딧과 구매 내역을 확인해 주세요. 중복 결제를 하지 말고 고객센터로 결제 시각과 주문 내역을 보내주세요."
  },
  {
    "question": "분석에 실패하면 크레딧은 어떻게 되나요?",
    "answer": "분석이 실패하면 해당 분석에 사용한 크레딧은 자동 반환됩니다. 보유 잔액을 확인하고 반환되지 않았다면 고객센터에 문의해 주세요."
  },
  {
    "question": "결제 취소나 환불은 어떻게 신청하나요?",
    "answer": "마이페이지 → 고객지원 → 문의하기에서 신청할 수 있습니다. 고객센터가 구매·사용 내역을 확인하여 관련 법령과 크레딧 환불 정책에 따라 처리합니다."
  },
  {
    "question": "크레딧 유효기간이 있나요?",
    "answer": "네. 구매한 크레딧의 유효기간은 구매일로부터 1년입니다. 만료 및 환불 관련 세부 사항은 정책에서 확인할 수 있습니다."
  },
  {
    "question": "결제 내역은 어디에서 볼 수 있나요?",
    "answer": "마이페이지 → 이용권·결제 → 구매 내역에서 확인할 수 있습니다. 결제대행사는 NICEPAY입니다."
  }
];

const FaqPayment = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white">
      <div className="shrink-0 px-[24px] py-[16px]">
        <MyPageHeader title="결제와 크레딧" onBack={() => navigate("/mypage/support/faq")} />
      </div>
      <div className="mt-[20px] flex shrink-0 flex-col gap-[19px] px-[24px] pb-[42px] font-['Noto_Sans_KR',sans-serif] leading-[1.58]">
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
          결제 장애를 문의할 때는 거래 일시와 주문번호를 함께 알려주면 확인에 도움이 됩니다.
        </aside>
      </div>
    </main>
  );
};

export default FaqPayment;
