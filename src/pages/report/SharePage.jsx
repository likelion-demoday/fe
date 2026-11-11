import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getSharedCharacterImage, getSharedReport } from "../../api/share";
import AppHeader from "../../components/common/AppHeader";
import ReportContent from "./ReportContent";
import { toSharedReportView } from "../../utils/reportMapper";

const EXPIRED_MESSAGE = "링크가 만료되었거나 더 이상 볼 수 없어요";

const getErrorMessage = (e) => {
  if (e.response?.status === 404) return EXPIRED_MESSAGE;
  if (e.response?.status === 429) return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
  return "보고서를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
};

const withImages = (report, images) => {
  const attach = (speaker) => ({
    ...speaker,
    character: { ...speaker.character, imageUrl: images[speaker.role] },
  });
  return { ...report, speakers: { me: attach(report.speakers.me), partner: attach(report.speakers.partner) } };
};

// 공개 보고서 (/share#토큰). 토큰은 Authorization 헤더로만 보내고 저장하거나 로그에 남기지 않음
const SharePage = () => {
  const navigate = useNavigate();
  const token = useLocation().hash.slice(1);
  const [loaded, setLoaded] = useState({ token: null, report: null, images: {}, message: null });

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const imageUrls = [];

    // 캐릭터 이미지는 없을 수 있음 → 실패하면 이미지 없는 카드로 표시
    const loadImage = async (speakerRole) => {
      try {
        const blob = await getSharedCharacterImage(token, speakerRole);
        const url = URL.createObjectURL(blob);
        imageUrls.push(url);
        return [speakerRole, url];
      } catch {
        return null;
      }
    };

    const load = async () => {
      try {
        const result = await getSharedReport(token);
        const report = toSharedReportView(result);
        if (cancelled) return;
        setLoaded({ token, report, images: {}, message: null });

        const entries = await Promise.all((result.speakerRoles ?? []).map(loadImage));
        if (!cancelled) setLoaded((prev) => ({ ...prev, images: Object.fromEntries(entries.filter(Boolean)) }));
      } catch (e) {
        if (!cancelled) setLoaded({ token, report: null, images: {}, message: getErrorMessage(e) });
      }
    };

    load();

    return () => {
      cancelled = true;
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [token]);

  const isCurrent = loaded.token === token;
  const report = isCurrent && loaded.report ? withImages(loaded.report, loaded.images) : null;
  const message = token ? isCurrent && loaded.message : EXPIRED_MESSAGE;

  if (!report) {
    return (
      <main className="mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col bg-white px-[24px] py-[16px]">
        <AppHeader showProfile={false} onLogoClick={() => navigate("/home")} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-title-medium text-center whitespace-pre-line text-[#595959]">
            {message || "보고서를 불러오는 중이에요"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[min(844px,100dvh)] w-[390px] flex-col bg-white">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-[20px] overflow-x-hidden overflow-y-auto px-[24px] py-[16px]">
        <AppHeader showProfile={false} onLogoClick={() => navigate("/home")} />
        <ReportContent report={report} />
      </div>
    </main>
  );
};

export default SharePage;
