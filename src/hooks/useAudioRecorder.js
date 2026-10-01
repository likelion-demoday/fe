import { useCallback, useEffect, useRef, useState } from "react";

const BAR_COUNT = 63;

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
];

const pickMimeType = () => {
  if (typeof MediaRecorder === "undefined") return null;
  return (
    MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
  );
};

const toErrorCode = (e) => {
  switch (e?.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "denied";
    case "NotFoundError":
    case "OverconstrainedError":
      return "notfound";
    case "NotReadableError":
      return "busy";
    default:
      return "unknown";
  }
};

export function useAudioRecorder() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [levels, setLevels] = useState(() => Array(BAR_COUNT).fill(0));

  const streamRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const rafRef = useRef(0);
  const volumeRef = useRef(0);

  const teardown = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    volumeRef.current = 0;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    analyserRef.current = null;
    recorderRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  useEffect(() => {
    if (status !== "recording") return;
    const id = setInterval(() => {
      setLevels((prev) => [
        ...prev.slice(1),
        volumeRef.current * (0.4 + Math.random() * 0.6),
      ]);
    }, 80);
    return () => clearInterval(id);
  }, [status]);

  const runMeter = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.fftSize);
    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const v of data) sum += ((v - 128) / 128) ** 2;
      const rms = Math.sqrt(sum / data.length);
      volumeRef.current = Math.min(1, rms * 8);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const start = useCallback(async () => {
    if (status === "recording" || status === "paused") return;

    setError(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyserRef.current = analyser;

      const mimeType = pickMimeType();
      if (mimeType === null) throw new Error("MediaRecorder unsupported");

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        setError("unknown");
        setStatus("idle");
        teardown();
      };
      recorderRef.current = recorder;

      recorder.start(1000);
      runMeter();
      setStatus("recording");
    } catch (e) {
      teardown();
      setError(
        e?.message === "MediaRecorder unsupported"
          ? "unsupported"
          : toErrorCode(e),
      );
      setStatus("idle");
    }
  }, [status, runMeter, teardown]);

  const pause = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state !== "recording") return;

    recorder.pause();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    volumeRef.current = 0;
    setLevels(Array(BAR_COUNT).fill(0));
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state !== "paused") return;

    recorder.resume();
    runMeter();
    setStatus("recording");
  }, [runMeter]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return Promise.resolve(null);

    const mimeType = recorder.mimeType || "audio/webm";

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        teardown();
        setLevels(Array(BAR_COUNT).fill(0));
        setStatus("stopped");
        resolve({ blob, mimeType });
      };
      recorder.stop();
    });
  }, [teardown]);

  const reset = useCallback(() => {
    teardown();
    chunksRef.current = [];
    setLevels(Array(BAR_COUNT).fill(0));
    setError(null);
    setStatus("idle");
  }, [teardown]);

  return {
    status,
    error,
    levels,
    isRecording: status === "recording",
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
