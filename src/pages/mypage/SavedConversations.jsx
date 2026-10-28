import RecordingArchive from "../../components/feature/mypage/RecordingArchive";
import { mockConversations } from "../../mocks/conversations";
import { useState } from "react";
import ConversationPlayback from "../../components/feature/mypage/ConversationPlayback";

const SavedConversations = ({
  conversations = mockConversations,
  onSelect,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const selected = conversations.find(({ id }) => id === selectedId);
  if (selected) return <ConversationPlayback key={selected.id} conversation={selected} onClose={() => setSelectedId(null)} />;
  return (
  <RecordingArchive
    title="저장된 대화"
    items={conversations}
    onSelect={onSelect ?? setSelectedId}
  />
  );
};

export default SavedConversations;
