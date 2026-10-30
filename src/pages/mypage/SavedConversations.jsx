import { useEffect, useRef, useState } from "react";
import { getRecording, getRecordingAudio, getRecordings } from "../../api/recording";
import RecordingArchive from "../../components/feature/mypage/RecordingArchive";
import ConversationPlayback from "../../components/feature/mypage/ConversationPlayback";

const RETENTION_MS = 3 * 24 * 60 * 60 * 1000;
const isRecordingUnavailable = (recording) =>
  recording.audioAvailable === false ||
  Date.now() >= new Date(recording.createdAt).getTime() + RETENTION_MS;

const mapRecording = (recording) => ({
  ...recording,
  id: recording.recordingId,
  date: new Date(recording.createdAt).toLocaleDateString("ko-KR"),
  durationMinutes: Math.round(recording.durationSeconds / 60),
  disabled: isRecordingUnavailable(recording),
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
    const expirations = recordings
      .map((recording) => new Date(recording.createdAt).getTime() + RETENTION_MS)
      .filter((expiration) => expiration > Date.now());
    if (!expirations.length) return;
    const timer = setTimeout(() => {
      setRecordings((current) => [...current]);
    }, Math.min(Math.min(...expirations) - Date.now(), 2147483647));
    return () => clearTimeout(timer);
  }, [recordings]);

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
    const recording = recordings.find((item) => item.recordingId === id);
    if (!recording || isRecordingUnavailable(recording)) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setSelected({ ...mapRecording(recording), audioUrl: undefined });
    setPlaybackLoading(true);
    setPlaybackError("");
    try {
      const detail = await getRecording(id, { signal: controller.signal });
      if (controller.signal.aborted) return;
      if (isRecordingUnavailable({ ...recording, ...detail })) {
        setRecordings((current) => current.map((item) => item.recordingId === id ? { ...item, audioAvailable: false } : item));
        setSelected(null);
        return;
      }
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
