import RecordingArchive from "../../components/feature/mypage/RecordingArchive";
import { mockReports } from "../../mocks/reports";

const ReportArchive = ({ reports = mockReports, onSelect }) => (
  <RecordingArchive
    title="보고서 보관함"
    items={reports}
    initialCategory="친구관계"
    onSelect={onSelect}
  />
);

export default ReportArchive;
