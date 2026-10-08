import { useNavigate } from "react-router-dom";

import RecordingArchive from "../../components/feature/mypage/RecordingArchive";
import { mockReports } from "../../mocks/reports";

const ReportArchive = ({ reports = mockReports, onSelect }) => {
  const navigate = useNavigate();

  return (
    <RecordingArchive
      title="보고서 보관함"
      items={reports}
      initialCategory="친구관계"
      onSelect={onSelect ?? ((id) => navigate(`/report/${id}`))}
    />
  );
};

export default ReportArchive;
