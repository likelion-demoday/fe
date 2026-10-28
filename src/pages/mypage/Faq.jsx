import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";
import PurchaseHistory from "../../components/feature/mypage/PurchaseHistory";

const FAQ_PATHS = {
  "서비스 이용": "service",
  "녹음과 분석": "recording",
  "결제와 크레딧": "payment",
  "계정과 개인정보": "account",
};

const FAQ_GROUPS = [
  {
    title: "서비스 이용",
    questions: [
      "RE:SAY는 어떤 서비스인가요?",
      "어떤 대화를 분석할 수 있나요?",
      "분석 결과는 얼마나 정확한가요?",
      "보고서는 어디에서 다시 볼 수 있나요?",
    ],
  },
  {
    title: "녹음과 분석",
    questions: [
      "대화 상대방의 동의가 필요한가요?",
      "녹음이 중단되거나 업로드에 실패했어요.",
      "화자를 잘못 선택했어요.",
      "분석이 실패하거나 오래 걸려요.",
    ],
  },
  {
    title: "결제와 크레딧",
    questions: [
      "크레딧은 어떻게 사용하나요?",
      "결제했는데 크레딧이 지급되지 않았어요.",
      "분석 실패 시 크레딧은 어떻게 되나요?",
      "결제 취소·환불은 어떻게 신청하나요?",
    ],
  },
  {
    title: "계정과 개인정보",
    questions: [
      "내 녹음 파일과 보고서는 안전한가요?",
      "녹음 파일과 보고서를 삭제할 수 있나요?",
      "광고성 알림을 끄고 싶어요.",
      "회원 탈퇴는 어떻게 하나요?",
    ],
  },
];

const Faq = ({ onSelectQuestion }) => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white">
      <div className="shrink-0 px-[24px] py-[16px]">
        <MyPageHeader
          title="자주 묻는 질문"
          titleClassName="text-heading"
          onBack={() => navigate("/mypage/support")}
        />
      </div>
      <div className="mt-[20px] flex shrink-0 flex-col gap-[19px] px-[24px] pb-[42px] font-['SUIT',sans-serif] text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#262626]">
        <p className="text-[#787878]">이용 중 궁금했던 내용을 빠르게 찾아보세요.</p>
        {FAQ_GROUPS.map(({ title, questions }, groupIndex) => (
          <Fragment key={title}>
            <div className="h-px w-full bg-[#f1eceb]" />
            <section aria-labelledby={`faq-group-${groupIndex}`} className="flex flex-col gap-[19px]">
              <h2 id={`faq-group-${groupIndex}`}>
                {FAQ_PATHS[title] ? (
                  <button type="button" className="cursor-pointer" onClick={() => navigate(`/mypage/support/faq/${FAQ_PATHS[title]}`)}>{title}</button>
                ) : title}
              </h2>
              <div className="flex flex-col gap-[2px]">
                {questions.map((question, questionIndex) => (
                  <Fragment key={question}>
                    <PurchaseHistory
                      label={question}
                      to={!onSelectQuestion && FAQ_PATHS[title] ? `/mypage/support/faq/${FAQ_PATHS[title]}#question-${questionIndex + 1}` : undefined}
                      className="mypage-press-row flex h-[49px] w-full cursor-pointer items-center justify-between text-left"
                      trailing={<span aria-hidden="true" className="w-[18px] shrink-0 text-[#999]">›</span>}
                      onClick={onSelectQuestion ? () => onSelectQuestion(question) : undefined}
                    />
                    <div className="h-px w-full bg-[#f1eceb]" />
                  </Fragment>
                ))}
              </div>
            </section>
          </Fragment>
        ))}
        <aside className="rounded-[12px] bg-[#fffaf9] px-[14px] py-[13px] text-[#787878]">
          분석 오류 또는 결제 문제가 해결되지 않았나요? 마이페이지 → 고객지원 → 문의하기를 이용해 주세요.
        </aside>
      </div>
    </main>
  );
};

export default Faq;
