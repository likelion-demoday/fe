import { useNavigate } from "react-router-dom";
import MyPageHeader from "../../components/feature/mypage/MyPageHeader";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[30px] overflow-y-auto bg-white px-[24px] py-[16px]">
      <MyPageHeader title="문의하기" titleClassName="text-heading" onBack={() => navigate("/mypage/support")} />
      <section className="rounded-[20px] bg-white px-[24px] py-[36px] shadow-[0_2px_6px_rgba(0,0,0,0.05),0_0_11.4px_rgba(0,0,0,0.05)]">
        <p className="text-label text-[#262626]">
          <a href="mailto:hoslee404@gmail.com" className="focus-visible:outline-2 focus-visible:outline-offset-2">hoslee404@gmail.com</a>
          <br />
          으로 문의사항을 남겨주시면 답변드립니다.
        </p>
      </section>
    </main>
  );
};

export default Contact;
