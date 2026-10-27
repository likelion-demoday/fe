import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";

const QUESTIONS = [
  {
    question: "대화 상대방의 동의가 필요한가요?",
    answer: "녹음과 AI 분석 목적을 상대방에게 알리고 필요한 동의를 사용자가 직접 구두로 확인합니다. RE:SAY는 상대방 동의를 별도로 수집하거나 검증하지 않습니다.",
  },
  {
    question: "녹음이 중단되거나 업로드에 실패했어요.",
    answer: "녹음은 최대 30분입니다. 마이크 권한과 인터넷 상태를 확인하고 녹음·업로드 중에는 화면을 유지해 주세요.",
  },
  {
    question: "화자를 잘못 선택했어요.",
    answer: "분석 전 화자별 목소리를 듣고 본인의 화자를 확인해 주세요.",
  },
  {
    question: "분석이 실패하거나 오래 걸려요.",
    answer: "음성 품질·발화량·서버 오류 등으로 실패할 수 있습니다. 분석이 실패하면 사용한 크레딧은 자동 반환됩니다.",
  },
  {
    question: "분석 중 화면을 닫아도 되나요?",
    answer: "파일 업로드를 완료한 뒤 서버 분석이 시작되면 화면을 나가도 분석이 계속됩니다. 녹음 중이나 업로드 중에는 화면을 유지해야 합니다.",
  },
  {
    question: "분석에 사용할 수 있는 파일 형식과 크기는?",
    answer: "녹음은 최대 30분입니다.",
  },
];

const FaqRecording = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white">
      <div className="shrink-0 px-[24px] py-[16px]">
        <MyPageHeader title="녹음과 분석" onBack={() => navigate("/mypage/support/faq")} />
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
      </div>
    </main>
  );
};

export default FaqRecording;
