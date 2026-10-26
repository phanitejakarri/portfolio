import { useEffect, useRef, useState } from "react";

const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-+&/>";

function FlapChar({ target, delay, hot }: { target: string; delay: number; hot?: boolean }) {
  const cur = useRef(" ");
  const [state, setState] = useState({ cur: " ", prev: " ", tick: 0 });

  useEffect(() => {
    if (cur.current === target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let steps = reduce ? 1 : 3 + Math.floor(Math.random() * 7);
    let t = 0;
    const step = () => {
      const next = steps <= 1 ? target : CHARSET[1 + Math.floor(Math.random() * (CHARSET.length - 1))];
      const prev = cur.current;
      cur.current = next;
      setState((s) => ({ cur: next, prev, tick: s.tick + 1 }));
      steps--;
      if (steps > 0) t = window.setTimeout(step, 95);
    };
    t = window.setTimeout(step, delay);
    return () => clearTimeout(t);
  }, [target, delay]);

  const { cur: c, prev: p, tick } = state;
  return (
    <span className={`flap ${hot ? "hot" : ""}`} aria-hidden>
      <span className="half top">
        <span>{c}</span>
      </span>
      <span className="half bottom">
        <span>{p}</span>
      </span>
      {tick > 0 && (
        <>
          <span key={`o${tick}`} className="half top leaf-out">
            <span>{p}</span>
          </span>
          <span key={`i${tick}`} className="half bottom leaf-in">
            <span>{c}</span>
          </span>
        </>
      )}
    </span>
  );
}

// A row of split-flap tiles that riffle through letters until they land on `text`.
export default function SplitFlap({
  text,
  length,
  size,
  delay = 0,
  hot,
  className = "",
}: {
  text: string;
  length?: number;
  size: number | string;
  delay?: number;
  hot?: boolean;
  className?: string;
}) {
  const t = text.toUpperCase().padEnd(length ?? text.length, " ").slice(0, length ?? text.length);
  return (
    <span
      className={`inline-flex whitespace-nowrap ${className}`}
      style={{ "--h": typeof size === "number" ? `${size}px` : size } as React.CSSProperties}
      role="text"
      aria-label={text}
    >
      {[...t].map((ch, i) => (
        <FlapChar key={i} target={CHARSET.includes(ch) ? ch : " "} delay={delay + i * 35} hot={hot} />
      ))}
    </span>
  );
}
