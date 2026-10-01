import { useEffect, useRef, useState } from "react";

const BAR_COUNT = 63;

export function useMicVolume(active) {
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState(null);

  const rafRef = useRef(0);
  const volumeRef = useRef(0);

  const [levels, setLevels] = useState(Array(BAR_COUNT).fill(0));

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setLevels((prev) => [
        ...prev.slice(1),
        volumeRef.current * (0.4 + Math.random() * 0.6),
      ]);
    }, 80);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    let ctx, stream;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.fftSize);

        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (const v of data) sum += ((v - 128) / 128) ** 2;
          const rms = Math.sqrt(sum / data.length);
          const v = Math.min(1, rms * 8); 
          setVolume(v); 
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch (e) {
        setError(e.name === "NotAllowedError" ? "denied" : "unknown");
      }
    })();

    return () => {
      cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close();
    };
  }, [active]);

  return { levels, error };
}
