import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

// Giant name in a variable font: letters near the pointer tighten from a light
// cut into a black, condensed one (they only ever get narrower, so lines never overflow). On touch devices a slow wave does it instead.
export default function VariableName({ lines, className = "", align = [] }: { lines: string[]; className?: string; align?: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const letters = [...el.querySelectorAll<HTMLSpanElement>(".vl")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;

    animate(letters, {
      translateY: ["105%", "0%"],
      duration: 1300,
      delay: stagger(45, { start: 150 }),
      ease: "outExpo",
    });
    if (reduce) return;

    const state = letters.map(() => ({ w: 260, s: 100 }));
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const tick = (now: number) => {
      const radius = Math.max(220, window.innerWidth * 0.2);
      letters.forEach((l, i) => {
        let t: number;
        if (touch) {
          t = (Math.sin(now / 900 - i * 0.55) + 1) / 2;
          t = t * t * 0.9;
        } else {
          const r = l.getBoundingClientRect();
          const d = Math.hypot(r.left + r.width / 2 - mouse.x, r.top + r.height / 2 - mouse.y);
          t = Math.max(0, 1 - d / radius);
          t = t * t * (3 - 2 * t);
        }
        const st = state[i];
        st.w += (260 + 640 * t - st.w) * 0.14;
        st.s += (100 - 32 * t - st.s) * 0.14;
        l.style.fontVariationSettings = `"wght" ${st.w.toFixed(1)}, "wdth" ${st.s.toFixed(1)}`;
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className={className} aria-label={lines.join(" ")} role="heading" aria-level={1}>
      {lines.map((line, li) => (
        <div key={li} className={`whitespace-nowrap ${align[li] ?? ""}`} aria-hidden>
          {[...line].map((ch, i) => (
            <span key={i} className="mask">
              <span className="vl inline-block" style={{ fontVariationSettings: '"wght" 260, "wdth" 100' }}>
                {ch === " " ? " " : ch}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
