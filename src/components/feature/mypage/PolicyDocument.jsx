import { useNavigate } from "react-router-dom";
import MyPageHeader from "./MyPageHeader";

const PolicyDocument = ({ title, description, sections, footer }) => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col overflow-y-auto bg-white">
      <div className="shrink-0 px-[24px] py-[16px]">
        <MyPageHeader title={title} titleClassName="text-heading" onBack={() => navigate("/mypage/support/policies")} />
      </div>
      <article className="mt-[20px] flex shrink-0 flex-col gap-[19px] px-[24px] pb-[42px] font-['SUIT',sans-serif] text-[14px] leading-[20px] font-medium tracking-[-0.14px]">
        <p className="text-[#787878]">{description}</p>
        {sections.map(([heading, content], index) => (
          <section key={heading} aria-labelledby={`policy-section-${index + 1}`} className="flex flex-col gap-[7px] border-t border-[#f1eceb] pt-[19px]">
            <h2 id={`policy-section-${index + 1}`} className="text-[#262626]">{heading}</h2>
            <p className="whitespace-pre-line text-[#787878]">{content}</p>
          </section>
        ))}
        <aside className="rounded-[12px] bg-[#fffaf9] px-[14px] py-[13px] text-[#787878]">{footer}</aside>
      </article>
    </main>
  );
};

export default PolicyDocument;
