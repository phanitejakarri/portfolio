import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { projects as all, previewOf, type Project } from "@/lib/data";
import { TLink } from "@/components/Transition";
import Scramble from "@/components/Scramble";
import { createHoverGL, type HoverGL } from "@/lib/hoverGL";
import { useLatestCommits, formatDate } from "@/lib/commits";
import type { Category } from "@/lib/data";

const COLS = "lg:grid-cols-[4rem_1fr_9rem_15rem_4rem_2.5rem]";

// one lane per category, like branches in `git log --graph`
const LANES: Record<Category, { x: number; color: string; name: string }> = {
  Web: { x: 8, color: "#FFB547", name: "web" },
  "AI / ML": { x: 22, color: "#7AA7FF", name: "ai-ml" },
  Tools: { x: 36, color: "#4CC38A", name: "tools" },
};
const RAIL = "#2c2c2c";

// The slice of the graph that belongs to one row: rails, the curve in from the previous
// commit's lane, this commit's node, and the line on down to the next row.
function Graph({ lane, from, y, last, lit, hot }: { lane: Category; from: Category; y: number; last: boolean; lit: boolean; hot: boolean }) {
  const L = LANES[lane];
  const F = LANES[from];
  const c = lit ? L.color : RAIL;
  return (
    <div className="absolute inset-y-0 left-0 w-12 pointer-events-none" aria-hidden>
      {Object.values(LANES).map((l) => (
        <div key={l.x} className="absolute inset-y-0 border-l border-dashed border-chalk/[0.06]" style={{ left: l.x }} />
      ))}
      <svg className="absolute left-0 top-0 w-12 overflow-visible" height={y} viewBox={`0 0 48 ${y}`}>
        <path
          d={`M${F.x},0 C${F.x},${y * 0.55} ${L.x},${y * 0.45} ${L.x},${y}`}
          fill="none"
          stroke={c}
          strokeWidth={1.6}
          style={{ transition: "stroke .7s" }}
        />
      </svg>
      {!last && (
        <div className="absolute bottom-0 w-[1.6px] -translate-x-1/2" style={{ left: L.x, top: y, background: c, transition: "background-color .7s" }} />
      )}
      <div
        className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500"
        style={{
          left: L.x,
          top: y,
          borderColor: lit ? L.color : "#4a4a4a",
          background: hot ? L.color : "#0D0D0D",
          transform: `translate(-50%, -50%) scale(${hot ? 1.35 : 1})`,
          boxShadow: hot ? `0 0 0 5px ${L.color}22` : "none",
        }}
      />
    </div>
  );
}

// A typographic index drawn as `git log --graph`. Hover: the name flips like a split-flap
// and a WebGL screenshot bends after the cursor. Click: the full case study.
export default function ProjectList({ items }: { items: Project[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const gl = useRef<HoverGL | null>(null);
  const key = items.map((p) => p.slug).join();
  const commits = useLatestCommits(all.map((p) => p.repos[0]));
  const rows = useRef<Record<string, HTMLLIElement | null>>({});
  const titles = useRef<Record<string, HTMLSpanElement | null>>({});
  const [nodeY, setNodeY] = useState<Record<string, number>>({});
  const [lit, setLit] = useState<Record<string, boolean>>({});

  // where each commit node sits: level with the middle of the project's name
  useEffect(() => {
    const measure = () => {
      const next: Record<string, number> = {};
      items.forEach((p) => {
        const li = rows.current[p.slug], t = titles.current[p.slug];
        if (li && t) next[p.slug] = Math.round(t.getBoundingClientRect().top - li.getBoundingClientRect().top + t.offsetHeight / 2);
      });
      setNodeY(next);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [key]);

  // the graph lights up commit by commit as rows scroll past 65% of the viewport
  useEffect(() => {
    const on = () => {
      const line = window.innerHeight * 0.65;
      const next: Record<string, boolean> = {};
      items.forEach((p) => {
        const li = rows.current[p.slug];
        next[p.slug] = !!li && li.getBoundingClientRect().top + (nodeY[p.slug] ?? 50) < line;
      });
      setLit((prev) => (items.every((p) => prev[p.slug] === next[p.slug]) ? prev : next));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [key, nodeY]);

  useEffect(() => {
    if (!canvas.current || window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches) return;
    gl.current = createHoverGL(canvas.current);
    return () => gl.current?.destroy();
  }, []);

  useEffect(() => {
    const p = items.find((q) => q.slug === hover);
    gl.current?.show(p ? previewOf(p) : null);
  }, [hover, items]);

  useEffect(() => {
    if (!list.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animate(list.current.querySelectorAll(":scope > li"), { opacity: [0, 1], translateY: [24, 0], duration: 800, delay: stagger(55), ease: "outExpo" });
  }, [key]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-6 font-mono text-[12px] text-mute">
        <span>
          <span className="text-saffron">$</span> git log --graph --all <span className="text-chalk/30">— live from GitHub</span>
        </span>
        <span className="flex gap-5">
          {Object.values(LANES).map((l) => (
            <span key={l.name} className="inline-flex items-center gap-2">
              <span className="w-4 h-[2px]" style={{ background: l.color }} />
              {l.name}
            </span>
          ))}
        </span>
      </div>
      <div className={`hidden lg:grid ${COLS} gap-8 label text-mute pb-4 border-b border-edge`}>
        <span>Graph</span>
        <span>Project</span>
        <span>Type</span>
        <span>Stack</span>
        <span className="text-right">Year</span>
        <span />
      </div>

      <ul ref={list} onMouseLeave={() => setHover(null)}>
        {items.map((p, i) => {
          const c = commits[p.repos[0]];
          const dim = hover && hover !== p.slug;
          return (
            <li key={p.slug} ref={(el) => (rows.current[p.slug] = el)} className="relative border-b border-edge">
              {nodeY[p.slug] !== undefined && (
                <Graph
                  lane={p.category}
                  from={(items[i - 1] ?? p).category}
                  y={nodeY[p.slug]}
                  last={i === items.length - 1}
                  lit={!!lit[p.slug]}
                  hot={hover === p.slug}
                />
              )}
              <TLink
                to={`/work/${p.slug}`}
                onMouseEnter={() => setHover(p.slug)}
                className={`group grid grid-cols-[3rem_1fr_auto] ${COLS} gap-x-4 lg:gap-x-8 items-baseline py-7 md:py-9 transition-opacity duration-500 ${
                  dim ? "lg:opacity-30" : ""
                }`}
              >
                <span aria-hidden />
                <span className="min-w-0">
                  <span
                    ref={(el) => (titles.current[p.slug] = el)}
                    className={`block font-bold semi text-[clamp(1.9rem,4.2vw,3.6rem)] leading-[0.95] tracking-[-0.025em] whitespace-nowrap overflow-hidden text-ellipsis transition-[transform,color] duration-500 ease-expo group-hover:translate-x-2 ${
                      "group-hover:text-saffron"
                    }`}
                  >
                    <Scramble text={p.short} run={hover === p.slug} />
                  </span>
                  <span className="block mt-3 text-chalk/55 text-[15px] leading-snug max-w-[56ch]">{p.summary}</span>
                  {c && (
                    <span className="block mt-3 font-mono text-[11.5px] text-mute">
                      <span style={{ color: LANES[p.category].color }}>{c.sha}</span>
                      <span className="text-chalk/25"> on </span>
                      {LANES[p.category].name}
                      <span className="text-chalk/25"> · </span>
                      {formatDate(c.date)}
                    </span>
                  )}
                </span>
                <span
                  className="lg:hidden w-9 h-9 rounded-full border border-edge flex items-center justify-center transition-transform duration-500 group-hover:-rotate-45"
                  aria-hidden
                >
                  →
                </span>
                <span className="hidden lg:block text-chalk/70 text-[15px]">{p.category}</span>
                <span className="hidden lg:block text-chalk/70 text-[15px]">{p.tags.slice(0, 3).join(", ")}</span>
                <span className="hidden lg:block label text-mute text-right">{p.year}</span>
                <span
                  className="hidden lg:flex w-9 h-9 rounded-full border border-edge items-center justify-center justify-self-end transition-all duration-500 group-hover:bg-saffron group-hover:border-saffron group-hover:text-night group-hover:-rotate-45"
                  aria-hidden
                >
                  →
                </span>
              </TLink>
            </li>
          );
        })}
      </ul>

      <canvas ref={canvas} className="hidden lg:block fixed left-0 top-0 z-[60] pointer-events-none" aria-hidden />
    </>
  );
}
