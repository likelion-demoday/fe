import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import AppHeader from "../../components/common/AppHeader";
import ActionCard from "../../components/feature/analysis/ActionCard";
import microphoneSpeakingIcon from "../../assets/icons/microphone-speaking.svg";
import attachmentIcon from "../../assets/icons/attachment.svg";

const NOTICES = [
  "녹음된 음성은 대화 분석에 사용돼요.",
  "주변 소음이나 녹음 상태에 따라 분석 결과가 정확하지 않을 수 있어요.",
  "함께 대화하는 사람이 있다면 녹음 사실을 먼저 알려주세요.",
  "개인정보나 민감한 내용은 녹음하지 않는 걸 권장해요.",
];

const AnalysisStart = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("녹음 파일 선택", file);
  };

  return (
    <main className="mx-auto flex h-[844px] w-[390px] flex-col gap-[30px] overflow-y-auto no-scrollbar bg-white px-[24px] py-[16px]">
      <AppHeader title="대화 분석" onLogoClick={()=>navigate("/home")}/>

      <div className="flex w-full flex-col gap-[60px]">
        <div className="flex w-full flex-col items-end gap-[8px]">
          <ul className="text-label w-full list-disc space-y-[19px] rounded-[16px] bg-white py-[24px] pr-[24px] pl-[48px] text-black drop-shadow-[0px_4px_5.85px_rgba(0,0,0,0.05)] drop-shadow-[0px_0px_23.85px_rgba(0,0,0,0.1)]">
            {NOTICES.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
          <button type="button" className="text-label-small border-b border-[#f5f5f5] text-[#d9d9d9]">
            개인정보 처리방침 · 녹음 데이터 처리 안내
          </button>
        </div>

        <div className="flex w-full flex-col gap-[24px]">
          <ActionCard
            icon={<img src={microphoneSpeakingIcon} alt="" className="size-[24px] shrink-0" />}
            label="새로 녹음 시작하기"
            onClick={() => navigate("/analysis/partner")}
          />
          <ActionCard
            icon={<img src={attachmentIcon} alt="" className="size-[24px] shrink-0" />}
            label="대화 녹음 가져오기"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </main>
  );
};

export default AnalysisStart;
