import { useEffect, useRef, useState } from "react";
import { getRecording, getRecordingAudio, getRecordings } from "../../api/recording";
import RecordingArchive from "../../components/feature/mypage/RecordingArchive";
import ConversationPlayback from "../../components/feature/mypage/ConversationPlayback";

const mapRecording = (recording) => ({
  ...recording,
  id: recording.recordingId,
  date: new Date(recording.createdAt).toLocaleDateString("ko-KR"),
  durationMinutes: Math.round(recording.durationSeconds / 60),
  statusLabel: recording.audioAvailable ? undefined : "재생할 음성 파일이 없어요",
});

const SavedConversations = () => {
  const [recordings, setRecordings] = useState([]);
  const [page, setPage] = useState(-1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [playbackLoading, setPlaybackLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState("");
  const pending = useRef(false);
  const controllerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    getRecordings({ signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        setRecordings(result.items);
        setPage(result.page);
        setHasNext(result.hasNext);
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setError(error?.message || "저장된 대화를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      controllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const url = selected?.audioUrl;
    return () => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [selected]);

  const loadMore = async () => {
    if (pending.current || loading) return;
    pending.current = true;
    setLoading(true);
    setError("");
    try {
      const result = await getRecordings({ page: page + 1 });
      setRecordings((previous) => [...previous, ...result.items]);
      setPage(result.page);
      setHasNext(result.hasNext);
    } catch (error) {
      setError(error?.message || "저장된 대화를 불러오지 못했어요.");
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

  const selectRecording = async (id) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setSelected({ ...mapRecording(recordings.find((item) => item.recordingId === id)), audioUrl: undefined });
    setPlaybackLoading(true);
    setPlaybackError("");
    try {
      const detail = await getRecording(id, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setSelected(mapRecording(detail));
      if (detail.audioAvailable && !detail.audioUrl) {
        const blob = await getRecordingAudio(id, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setSelected({ ...mapRecording(detail), audioUrl: URL.createObjectURL(blob) });
      }
    } catch (error) {
      if (!controller.signal.aborted)
        setPlaybackError(error?.message || "녹음을 불러오지 못했어요.");
    } finally {
      if (!controller.signal.aborted) setPlaybackLoading(false);
    }
  };

  if (selected) return (
    <ConversationPlayback
      key={selected.id}
      conversation={selected}
      loading={playbackLoading}
      loadError={playbackError}
      onRetry={() => selectRecording(selected.id)}
      onClose={() => {
        controllerRef.current?.abort();
        setSelected(null);
      }}
    />
  );

  return (
    <RecordingArchive
      title="대화 보관함"
      items={recordings.map(mapRecording)}
      onSelect={selectRecording}
      loading={loading}
      error={error}
      hasNext={hasNext}
      onLoadMore={loadMore}
      onRetry={loadMore}
    />
  );
};

export default SavedConversations;
