import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-/";

// Text that flips through random glyphs and settles left to right, like a split-flap
// board, every time `run` becomes true.
export default function Scramble({ text, run }: { text: string; run: boolean }) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  useEffect(() => {
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setOut(text);
    const start = performance.now();
    const dur = 420 + text.length * 22;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const settled = Math.floor(t * text.length);
      setOut(
        text
          .split("")
          .map((c, i) => (c === " " || i < settled ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("")
      );
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [run, text]);

  return (
    <span aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}
