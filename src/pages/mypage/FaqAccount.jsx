import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";

const QUESTIONS = [
  {
    "question": "내 음성 파일과 보고서는 안전한가요?",
    "answer": "음성 인식은 CLOVA, 분석은 LINER, 캐릭터 생성은 OpenAI를 사용합니다. 음성 원본과 전사 텍스트는 각각 저장 후 3일이 지나면 삭제됩니다. 보고서 보유기간 및 외부 업체의 데이터 보관·학습 사용 여부는 추가 확인이 필요합니다."
  },
  {
    "question": "녹음 파일과 보고서를 삭제할 수 있나요?",
    "answer": "네. 서비스에서 저장된 기록을 사용자가 직접 삭제할 수 있고, 회원 탈퇴 시에도 서비스 데이터는 삭제됩니다. 법령상 보존이 필요한 거래 기록은 예외입니다."
  },
  {
    "question": "광고성 알림을 끄고 싶어요.",
    "answer": "RE:SAY는 현재 광고성 이메일·문자·앱 알림을 운영하지 않습니다. 광고 발송을 시작하는 경우 별도 동의를 받고 언제든 수신 거부할 수 있도록 제공할 예정입니다."
  },
  {
    "question": "회원 탈퇴는 어떻게 하나요?",
    "answer": "마이페이지 → 계정 → 회원 탈퇴에서 진행할 수 있습니다. 탈퇴하면 남은 크레딧은 계정에서 삭제됩니다. 단, 소비자의 법정 환불·청약철회 권리까지 없어지는 것은 아니므로 먼저 고객센터를 통해 확인해 주세요."
  },
  {
    "question": "내 정보를 확인하거나 수정하고 싶어요.",
    "answer": "마이페이지에서 계정 정보와 닉네임을 관리할 수 있습니다. 개인정보 열람·수정·삭제 관련 추가 요청은 고객센터를 통해 할 수 있습니다. 연락처: [확정 필요]."
  }
];

const FaqAccount = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white">
      <div className="shrink-0 px-[24px] py-[16px]">
        <MyPageHeader title="계정과 개인정보" onBack={() => navigate("/mypage/support/faq")} />
      </div>
      <div className="mt-[20px] flex shrink-0 flex-col gap-[19px] px-[24px] pb-[42px] font-['Noto_Sans_KR',sans-serif] leading-[1.58]">
        <aside className="rounded-[12px] bg-[#fff1ef] p-[13px] text-[12px] font-normal text-[#a34f3d]">
          회원 탈퇴 이후 크레딧 처리, 음성·보고서 삭제 범위, 실제 수신거부 UI 구현 여부를 최종 점검해야 합니다.
        </aside>
        {QUESTIONS.map(({ question, answer }, index) => (
          <section
            key={question}
            id={`question-${index + 1}`}
            aria-labelledby={`question-title-${index + 1}`}
            className={`flex scroll-mt-[19px] flex-col ${index === QUESTIONS.length - 1 ? "gap-[19px]" : "gap-[7px]"} border-t border-[#f1eceb] pt-[19px]`}
          >
            <h2 id={`question-title-${index + 1}`} className="text-[14px] font-bold text-[#262626]">Q. {question}</h2>
            <p className="text-[12.6px] font-normal text-[#787878]">{answer}</p>
          </section>
        ))}
      </div>
    </main>
  );
};

export default FaqAccount;
