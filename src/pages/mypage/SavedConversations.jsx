import RecordingArchive from "../../components/feature/mypage/RecordingArchive";
import { mockConversations } from "../../mocks/conversations";

const SavedConversations = ({
  conversations = mockConversations,
  onSelect,
}) => (
  <RecordingArchive
    title="저장된 대화"
    items={conversations}
    onSelect={onSelect}
  />
);

export default SavedConversations;
