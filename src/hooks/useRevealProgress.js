import { useEffect, useState } from "react";

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;


const useRevealProgress = (active, durationMs) => {
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0));
  const [hasStarted, setHasStarted] = useState(false);

  if (active && !hasStarted) setHasStarted(true);

  useEffect(() => {
    if (!hasStarted || prefersReducedMotion()) return undefined;

    let frameId;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(easeOutCubic(t));
      if (t < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [hasStarted, durationMs]);

  return progress;
};

export default useRevealProgress;
