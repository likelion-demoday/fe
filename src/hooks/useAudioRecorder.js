import { useCallback, useEffect, useRef, useState } from "react";

const BAR_COUNT = 63;
const HEAD_INDEX = Math.floor(BAR_COUNT / 2);

const idleBar = () => 0.05 + Math.random() ** 1.5 * 0.45;
const createIdleLevels = () => Array.from({ length: BAR_COUNT }, idleBar);

const MIME_CANDIDATES = [
  "audio/mp4;codecs=mp4a.40.2", // AAC (일반 m4a와 같은 코덱)
  "audio/mp4",
];

const pickMimeType = () => {
  if (typeof MediaRecorder === "undefined") return null;
  return (
    MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? null
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
  const [levels, setLevels] = useState(createIdleLevels);
  const [head, setHead] = useState(-1);
  const headRef = useRef(-1);

  const streamRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const rafRef = useRef(0);
  const peakRef = useRef(0);

  const teardown = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    peakRef.current = 0;

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
      const peak = peakRef.current;
      peakRef.current = 0;

      const boosted = Math.min(1, peak * 2.2) ** 1.6;
      const value =
        0.04 + Math.random() * 0.03 + boosted * (0.5 + Math.random() * 0.5);

      if (headRef.current < HEAD_INDEX) {
        headRef.current += 1;
        const at = headRef.current;
        setHead(at);
        setLevels((prev) => {
          const copy = [...prev];
          copy[at] = value;
          return copy;
        });
      } else {
        setLevels((prev) => {
          const next = [...prev.slice(1), idleBar()];
          next[HEAD_INDEX] = value;
          return next;
        });
      }
    }, 80);
    return () => clearInterval(id);
  }, [status]);

  const runMeter = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.fftSize);
    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let peak = 0;
      for (const v of data) {
        const amp = Math.abs(v - 128) / 128;
        if ( amp > peak ) peak = amp;
      }
      if (peak > peakRef.current) peakRef.current = peak;
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
        { mimeType },
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

      recorder.start();
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
    peakRef.current = 0;
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state !== "paused") return;

    recorder.resume();
    runMeter();
    setStatus("recording");
  }, [runMeter]);

  const snapShot = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return null;
    Promise.resolve(null);

    const mimeType = recorder.mimeType || "audio/mp4";

    return new Promise((resolve) => {
      const handle = () => {
        recorder.removeEventListener("dataavailable", handle);
        resolve({blob: new Blob(chunksRef.current, { type: mimeType }), mimeType});
      };
      recorder.addEventListener("dataavailable", handle);
      recorder.requestData();
    });
  }, []);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive")
      return Promise.resolve(null);

    const mimeType = recorder.mimeType || "audio/mp4";

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        teardown();
        setLevels(createIdleLevels());
        setHead(-1);
        headRef.current = -1;
        setStatus("stopped");
        resolve({ blob, mimeType });
      };
      recorder.stop();
    });
  }, [teardown]);

  const reset = useCallback(() => {
    teardown();
    chunksRef.current = [];
    setLevels(createIdleLevels());
    setHead(-1);
    headRef.current = -1;
    setError(null);
    setStatus("idle");
  }, [teardown]);

  return {
    status,
    error,
    levels,
    head,
    isRecording: status === "recording",
    start,
    pause,
    resume,
    stop,
    reset,
    snapShot,
  };
}
