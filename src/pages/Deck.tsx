import { useCallback, useEffect, useRef, useState } from "react";
import { animate, stagger, remove } from "animejs";
import { ArrowUpRight } from "lucide-react";
import { projects, repoUrl } from "@/lib/data";
import ArchDiagram from "@/components/ArchDiagram";
import { TLink, useGo } from "@/components/Transition";

// Every screenshot becomes a card in one 3D stack; a project without screenshots gets one
// card showing its architecture diagram.
const cards = projects.flatMap((p, pi) => (p.photos.length ? p.photos.slice(0, 3) : [null]).map((src, k) => ({ src, pi, k })));

function pose(offset: number, k: number, mobile: boolean) {
  // offset: how many projects ahead (+) or behind (-) of the active one this card is
  const s = mobile ? 0.55 : 1;
  if (offset === 0) {
    // active project: main card upright, the other two fanned behind it
    if (k === 0) return { x: 0, y: 0, z: 0, rx: 0, rz: 0, scale: 1, opacity: 1 };
    return { x: (k === 1 ? -150 : 150) * s, y: -40 * s, z: -180, rx: 8, rz: k === 1 ? -7 : 7, scale: 0.78, opacity: 0.9 };
  }
  if (offset > 0) {
    // upcoming projects lie tilted back, stacked up and away like a deck on a table
    const d = offset * 3 + k;
    return { x: (120 + d * 26) * s, y: (-150 - d * 34) * s, z: -380 - d * 70, rx: 58, rz: -14, scale: 0.72, opacity: Math.max(0, 0.85 - d * 0.09) };
  }
  // passed projects slide down and out of view
  const d = -offset * 3 - k;
  return { x: (-160 + d * 10) * s, y: (620 + d * 30) * s, z: -200, rx: 62, rz: 10, scale: 0.8, opacity: 0 };
}

export default function Deck() {
  const go = useGo();
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const lock = useRef(0);
  const [mobile, setMobile] = useState(() => window.innerWidth < 900);
  const p = projects[active];

  const set = useCallback((i: number) => setActive(Math.max(0, Math.min(projects.length - 1, i))), []);

  useEffect(() => {
    const on = () => setMobile(window.innerWidth < 900);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // lay out the deck whenever the active project changes
  useEffect(() => {
    cards.forEach((c, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const t = pose(c.pi - active, c.k, mobile);
      remove(el);
      animate(el, {
        translateX: t.x,
        translateY: t.y,
        translateZ: t.z,
        rotateX: t.rx,
        rotateZ: t.rz,
        scale: t.scale,
        opacity: t.opacity,
        duration: 1300,
        delay: Math.abs(c.pi - active) * 40 + c.k * 60,
        ease: "outExpo",
      });
      el.style.zIndex = String(100 - Math.abs(c.pi - active) * 10 - c.k);
    });
    if (metaRef.current) animate(metaRef.current.querySelectorAll("[data-m]"), { opacity: [0, 1], translateY: [24, 0], duration: 900, delay: stagger(60), ease: "outExpo" });
    if (numRef.current) animate(numRef.current, { translateY: ["60%", "0%"], opacity: [0, 1], duration: 900, ease: "outExpo" });
  }, [active, mobile]);

  // wheel, keys and swipes step through the deck
  useEffect(() => {
    const step = (dir: number) => {
      const now = performance.now();
      if (now - lock.current < 750) return;
      lock.current = now;
      setActive((a) => Math.max(0, Math.min(projects.length - 1, a + dir)));
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 12) return;
      step(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) step(1);
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) step(-1);
    };
    let sx = 0, sy = 0;
    const onStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 50) step(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : dy < 0 ? 1 : -1);
    };
    const stage = document.getElementById("deck-stage");
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    stage?.addEventListener("touchstart", onStart, { passive: true });
    stage?.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      stage?.removeEventListener("touchstart", onStart);
      stage?.removeEventListener("touchend", onEnd);
    };
  }, []);

  return (
    <div className="relative h-[100svh] min-h-[640px] overflow-hidden pt-16 grid grid-rows-[1fr_auto] lg:grid-rows-1 lg:grid-cols-[300px_1fr_320px]">
      {/* left: details of the active project */}
      <aside ref={metaRef} key={active} className="hidden lg:flex flex-col justify-center gap-7 pl-10 pr-4">
        <div data-m>
          <div className="label text-mute mb-2">Role</div>
          <div>{p.role} · {p.year}</div>
        </div>
        <div data-m>
          <div className="label text-mute mb-2">Stack</div>
          <div className="leading-relaxed">{p.tags.join(", ")}</div>
        </div>
        <div data-m>
          <div className="label text-mute mb-2">What it does</div>
          <div className="text-chalk/75 text-[14.5px] leading-relaxed">{p.summary}</div>
        </div>
        <div data-m className="flex flex-col gap-2">
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-saffron">
              Live site <ArrowUpRight size={15} />
            </a>
          )}
          {p.repos[0] && (
            <a href={repoUrl(p.repos[0])} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-saffron">
              Source on GitHub <ArrowUpRight size={15} />
            </a>
          )}
        </div>
      </aside>

      {/* centre: the deck */}
      <div id="deck-stage" className="relative flex items-center justify-center [perspective:1600px] touch-pan-x">
        <div className="relative w-[78vw] max-w-[640px] lg:w-[46vw] aspect-[16/10] [transform-style:preserve-3d]">
          {cards.map((c, i) => (
            <div
              key={`${c.pi}-${c.k}`}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => (c.pi === active && c.k === 0 ? go(`/work/${projects[c.pi].slug}`) : set(c.pi))}
              className={`absolute inset-0 rounded-xl overflow-hidden bg-panel shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] will-change-transform cursor-pointer ${
                c.pi === active && c.k === 0 ? "ring-1 ring-chalk/20" : ""
              }`}
              style={{ opacity: 0 }}
            >
              {c.src ? (
                <img src={c.src} alt={`${projects[c.pi].title} screenshot ${c.k + 1}`} className="w-full h-full object-cover object-top" draggable={false} />
              ) : (
                <div className="w-full h-full flex items-center p-[5%]">
                  <ArchDiagram diagram={projects[c.pi].diagram} compact className="w-full" />
                </div>
              )}
              {c.pi === active && c.k === 0 && (
                <span className="absolute bottom-3 right-3 label bg-night/80 backdrop-blur px-3 py-1.5 rounded-full">Open case study →</span>
              )}
            </div>
          ))}
        </div>

        {/* big counter */}
        <div className="absolute left-5 lg:left-0 bottom-4 lg:bottom-8 flex items-end gap-3 pointer-events-none">
          <span className="mask">
            <div ref={numRef} className="font-black semi text-[clamp(5rem,12vw,10rem)] leading-[0.8] tracking-[-0.04em]">
              {String(active + 1).padStart(2, "0")}
            </div>
          </span>
          <span className="label text-mute mb-2">/ {String(projects.length).padStart(2, "0")}</span>
        </div>
        <div className="absolute right-5 lg:right-6 bottom-6 label text-mute hidden sm:block">Scroll, swipe or use ← →</div>
      </div>

      {/* right: project list */}
      <nav className="flex lg:flex-col justify-center gap-1 lg:gap-0 px-5 lg:pl-4 lg:pr-10 pb-6 lg:pb-0 overflow-x-auto">
        {projects.map((q, i) => (
          <button
            key={q.slug}
            onClick={() => set(i)}
            className={`text-left shrink-0 lg:py-4 lg:border-b border-edge transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
          >
            <span className="hidden lg:block label text-saffron mb-1.5">{q.category} · {q.year}</span>
            <span className="block font-bold semi text-[15px] lg:text-[22px] leading-tight rounded-full lg:rounded-none border lg:border-0 border-edge px-4 py-2 lg:p-0">
              {q.short}
            </span>
            <span className={`hidden lg:block text-[13.5px] text-chalk/60 mt-2 leading-snug transition-[max-height] duration-700 overflow-hidden ${i === active ? "max-h-24" : "max-h-0"}`}>
              {q.summary}
            </span>
          </button>
        ))}
        <TLink to="/work" className="hidden lg:block mt-6 label text-mute hover:text-saffron">
          ← Back to the index
        </TLink>
      </nav>
    </div>
  );
}
