import { useEffect, useRef, useState } from "react";
import { getAnalyses } from "../../api/analysis";
import RecordingArchive from "../../components/feature/mypage/RecordingArchive";

const CATEGORIES = {
  FRIEND_DAILY: "친구관계",
  COUPLE_DAILY: "연인관계",
  COUPLE_CONFLICT: "연인관계",
  PARENT_CHILD_CONFLICT: "부모 • 자녀관계",
};
const STATUSES = {
  ANALYZING: "분석 중",
  COMPLETED: "분석 완료",
  FAILED: "분석 실패",
};

const ReportArchive = ({ onSelect }) => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pending = useRef(false);

  useEffect(() => {
    let active = true;
    getAnalyses()
      .then((result) => {
        if (!active) return;
        setReports(result.items);
        setPage(result.page);
        setHasNext(result.hasNext);
      })
      .catch((error) => {
        if (active)
          setError(error?.message || "분석 목록을 불러오지 못했어요.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const loadMore = async () => {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError("");
    try {
      const result = await getAnalyses({ page: reports.length ? page + 1 : 0 });
      setReports((previous) => [...previous, ...result.items]);
      setPage(result.page);
      setHasNext(result.hasNext);
    } catch (error) {
      setError(error?.message || "분석 목록을 불러오지 못했어요.");
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

  return (
    <RecordingArchive
      title="보고서 보관함"
      items={reports.map((report) => ({
        id: report.recordingId,
        title: report.title,
        date: new Date(report.createdAt).toLocaleDateString("ko-KR"),
        durationMinutes: Math.round(report.durationSeconds / 60),
        category: CATEGORIES[report.relationshipType] || "기타",
        statusLabel: STATUSES[report.analysisStatus] || report.analysisStatus,
      }))}
      emptyMessage="아직 분석 내역이 없어요"
      onSelect={onSelect}
      loading={loading}
      error={error}
      hasNext={hasNext}
      onLoadMore={loadMore}
      onRetry={loadMore}
    />
  );
};

export default ReportArchive;
