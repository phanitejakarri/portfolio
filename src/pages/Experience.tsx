import { memo, useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { internships, leadership, education, achievements, certifications, skillGroups } from "@/lib/data";
import Reveal from "@/components/Reveal";
import { TLink } from "@/components/Transition";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const now = new Date();
const NOW = now.getFullYear() + now.getMonth() / 12;
// "Mar 2024" is a month; a bare "2019" starts in January when it opens a span and ends mid-year when it closes one
const parse = (s: string, end = false) => {
  const m = s.match(/([A-Z][a-z]{2})\s+(\d{4})/);
  if (m) return +m[2] + MONTHS.indexOf(m[1]) / 12;
  const y = s.match(/^\s*(\d{4})\s*$/);
  return y ? +y[1] + (end ? 0.5 : 0) : NOW;
};
const span = (when: string) => {
  const [a, b] = when.split(/\s*-\s*/);
  return { start: parse(a), end: b ? parse(b, true) : NOW };
};

type Kind = "work" | "community" | "education";
type Item = { id: string; kind: Kind; org: string; role: string; when: string; location?: string; desc?: string; details: string[]; logo?: string; start: number; end: number };

const items: Item[] = [
  ...internships.map((e) => ({ id: e.title + e.org, kind: "work" as Kind, org: e.org.split(",")[0], role: e.title, when: e.when, location: e.location, desc: e.desc, details: e.details, logo: e.logo, ...span(e.when) })),
  ...leadership.map((e) => ({ id: e.title + e.org, kind: "community" as Kind, org: e.org.split(",")[0], role: e.title, when: e.when, location: e.location, desc: e.desc, details: e.details, logo: e.logo, ...span(e.when) })),
  ...education.map((e) => ({ id: e.school, kind: "education" as Kind, org: e.school.split(",")[0], role: `${e.degree} · ${e.score}`, when: e.when, details: [], logo: e.logo, ...span(e.when) })),
];

const KIND: Record<Kind, { label: string; bar: string; dot: string }> = {
  work: { label: "Work", bar: "bg-saffron", dot: "bg-saffron" },
  community: { label: "Community", bar: "bg-chalk", dot: "bg-chalk" },
  education: { label: "Education", bar: "bg-[#5d5a55]", dot: "bg-[#5d5a55]" },
};

const T0 = 2018.6;
const T1 = 2027.2;
const pct = (t: number) => ((t - T0) / (T1 - T0)) * 100;

function Timeline({ hover, setHover }: { hover: string | null; setHover: (id: string | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const rows = [...items].sort((a, b) => a.start - b.start);

  useEffect(() => {
    const el = ref.current!;
    const bars = el.querySelectorAll<HTMLElement>(".gbar");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    bars.forEach((b) => (b.style.transform = "scaleX(0)"));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        animate(bars, { scaleX: [0, 1], duration: 1400, delay: stagger(90), ease: "outExpo" });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mt-14 select-none" onMouseLeave={() => setHover(null)}>
      {/* year grid */}
      <div className="absolute inset-0 left-[30%] md:left-[22%]">
        {Array.from({ length: 8 }, (_, k) => 2019 + k).map((y) => (
          <div key={y} className="absolute top-0 bottom-0 border-l border-edge" style={{ left: `${pct(y)}%` }}>
            <span className="absolute -top-7 -translate-x-1/2 label text-mute">{`'${String(y).slice(2)}`}</span>
          </div>
        ))}
        <div className="absolute top-[-14px] bottom-[-14px] w-px bg-saffron z-10" style={{ left: `${pct(NOW)}%` }}>
          <span className="absolute -bottom-6 -translate-x-1/2 label text-saffron">Now</span>
        </div>
      </div>

      <div className="relative flex flex-col gap-2">
        {rows.map((it) => {
          const k = KIND[it.kind];
          const dim = hover && hover !== it.id;
          const future = it.end > NOW;
          return (
            <div
              key={it.id}
              onMouseEnter={() => setHover(it.id)}
              onClick={() => document.getElementById(`x-${it.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className={`grid grid-cols-[30%_1fr] md:grid-cols-[22%_1fr] items-center cursor-pointer transition-opacity duration-300 ${dim ? "opacity-25" : ""}`}
            >
              <div className="pr-4 truncate">
                <span className="font-semibold text-[14px] md:text-[15px]">{it.org}</span>
                <span className="hidden md:inline text-mute text-[13px]"> · {it.kind === "education" ? "Education" : it.role}</span>
              </div>
              <div className="relative h-8 md:h-9">
                <div
                  className={`gbar absolute top-1 bottom-1 rounded-full ${k.bar} origin-left`}
                  style={{
                    left: `${pct(it.start)}%`,
                    width: `${Math.max(1.2, pct(Math.min(it.end, NOW)) - pct(it.start))}%`,
                  }}
                />
                {future && (
                  <div
                    className="absolute top-1 bottom-1 rounded-r-full border-2 border-dashed border-[#5d5a55]"
                    style={{ left: `${pct(NOW)}%`, width: `${pct(it.end) - pct(NOW)}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-6 mt-12 label text-mute">
        {(Object.keys(KIND) as Kind[]).filter((k) => items.some((i) => i.kind === k)).map((k) => (
          <span key={k} className="inline-flex items-center gap-2">
            <span className={`w-5 h-2 rounded-full ${KIND[k].dot}`} /> {KIND[k].label}
          </span>
        ))}
      </div>
    </div>
  );
}

// Memoised so hovering one entry only re-renders the two entries whose highlight changes.
const Entry = memo(function Entry({ it, active, setHover }: { it: Item; active: boolean; setHover: (id: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const running = useRef<{ pause: () => unknown }[]>([]);
  const mounted = useRef(false);
  const has = it.details.length > 0 || !!it.desc;

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    if (!mounted.current) {
      mounted.current = true; // starts closed; nothing to animate on first render
      return;
    }
    // stop anything still in flight so a quick second click doesn't fight the first
    running.current.forEach((a) => a.pause());
    const from = el.offsetHeight;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.height = open ? "auto" : "0px";
      return;
    }
    if (open) {
      el.style.height = "auto";
      const to = el.offsetHeight;
      el.style.height = `${from}px`;
      running.current = [
        animate(el, { height: [from, to], duration: 550, ease: "outQuart", onComplete: () => (el.style.height = "auto") }),
        animate(el.querySelectorAll("li, p"), { opacity: [0, 1], translateY: [10, 0], duration: 450, delay: stagger(40, { start: 60 }), ease: "outQuart" }),
      ];
    } else {
      running.current = [animate(el, { height: [from, 0], duration: 400, ease: "outQuart" })];
    }
  }, [open]);

  return (
    <div
      id={`x-${it.id}`}
      data-r
      onMouseEnter={() => setHover(it.id)}
      onMouseLeave={() => setHover(null)}
      className={`border-t border-edge py-6 transition-colors duration-300 ${active ? "bg-panel/60" : ""}`}
    >
      <button onClick={() => has && setOpen((o) => !o)} className="w-full text-left flex items-start gap-4" aria-expanded={open} disabled={!has}>
        {it.logo ? (
          <img src={it.logo} alt="" className="w-12 h-12 rounded-xl object-cover bg-chalk shrink-0" />
        ) : (
          <span className="w-12 h-12 rounded-xl bg-panel border border-edge shrink-0 flex items-center justify-center font-serif italic text-xl text-mute">{it.org[0]}</span>
        )}
        <span className="flex-1 min-w-0">
          <span className="flex items-baseline justify-between gap-4">
            <span className="font-bold semi text-2xl md:text-[1.75rem] leading-tight tracking-[-0.01em]">{it.org}</span>
            {has && <span className={`text-2xl text-mute transition-transform duration-500 ease-expo ${open ? "rotate-45 text-saffron" : ""}`}>+</span>}
          </span>
          <span className="block font-medium mt-1">{it.role}</span>
          <span className="block label text-mute mt-1.5">
            {it.when}
            {it.location ? ` · ${it.location.split(",")[0]}` : ""}
          </span>
        </span>
      </button>
      <div ref={body} className="overflow-hidden" style={{ height: 0 }}>
        <div className="pl-16 pt-4">
          {it.desc && <p className="text-chalk/85 leading-relaxed">{it.desc}</p>}
          <ul className="mt-3 space-y-2 text-chalk/60 text-[15px] leading-relaxed">
            {it.details.map((d) => (
              <li key={d} className="flex gap-3">
                <span className="text-saffron">—</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default function Experience() {
  const [hover, setHover] = useState<string | null>(null);
  const byKind = (k: Kind) => items.filter((i) => i.kind === k).sort((a, b) => b.start - a.start);

  return (
    <div className="px-5 md:px-10 pt-28 md:pt-36 pb-24">
      <div className="label text-mute">(Experience)</div>
      <h1 className="mt-6 font-bold semi text-[clamp(3rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.03em] max-w-[14ch]">
        Seven years, <span className="font-serif italic font-normal text-saffron">at a glance.</span>
      </h1>
      <p className="mt-6 max-w-[46ch] text-chalk/70 text-lg">
        College, a master&apos;s and every job since, on one timeline. Hover a bar to find it below, or open any entry for
        the full story.
      </p>

      <Timeline hover={hover} setHover={setHover} />

      <div className="mt-28 grid md:grid-cols-2 gap-x-16 gap-y-20">
        <Reveal>
          <h2 data-r className="font-bold semi text-3xl md:text-4xl mb-6">Work experience</h2>
          {byKind("work").map((it) => (
            <Entry key={it.id} it={it} active={hover === it.id} setHover={setHover} />
          ))}
        </Reveal>
        <div className="flex flex-col gap-20">
          {byKind("community").length > 0 && (
            <Reveal>
              <h2 data-r className="font-bold semi text-3xl md:text-4xl mb-6">Community</h2>
              {byKind("community").map((it) => (
                <Entry key={it.id} it={it} active={hover === it.id} setHover={setHover} />
              ))}
            </Reveal>
          )}
          <Reveal>
            <h2 data-r className="font-bold semi text-3xl md:text-4xl mb-6">Education</h2>
            {byKind("education").map((it) => (
              <Entry key={it.id} it={it} active={hover === it.id} setHover={setHover} />
            ))}
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-28 grid md:grid-cols-[1fr_2fr] gap-8">
        <h2 data-r className="font-bold semi text-3xl md:text-4xl">Recognition</h2>
        <div>
          {achievements.map((a) => (
            <div data-r key={a.title} className="border-t border-edge py-6 grid sm:grid-cols-[9rem_1fr] gap-2 last:border-b">
              <span className="font-serif italic text-saffron text-2xl">{a.mark}</span>
              <span>
                <span className="block font-semibold text-xl">{a.title}</span>
                <span className="block text-chalk/65 mt-1">{a.desc}</span>
              </span>
            </div>
          ))}
          {certifications.map((c) => (
            <div data-r key={c} className="border-t border-edge py-6 grid sm:grid-cols-[9rem_1fr] gap-2 last:border-b">
              <span className="font-serif italic text-saffron text-2xl">Certified</span>
              <span className="font-semibold text-xl">{c}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-28">
        <h2 data-r className="font-bold semi text-3xl md:text-4xl mb-10">Toolkit</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {skillGroups.map((g) => (
            <div data-r key={g.label}>
              <div className="label text-saffron mb-4">{g.label}</div>
              <ul className="space-y-1.5 text-lg">
                {g.items.map((s) => (
                  <li key={s} className="hover:translate-x-1.5 hover:text-saffron transition-all duration-300">{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <TLink to="/contact" className="group mt-32 flex items-end justify-between gap-6 border-t border-edge pt-10">
        <span>
          <span className="label text-mute">Next</span>
          <span className="block font-bold semi text-[clamp(2.6rem,7vw,6.5rem)] leading-none mt-3 tracking-[-0.03em] group-hover:text-saffron transition-colors">
            Say hello
          </span>
        </span>
        <span className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-saffron text-night text-3xl md:text-4xl flex items-center justify-center transition-transform duration-700 ease-expo group-hover:-rotate-45">
          →
        </span>
      </TLink>
    </div>
  );
}
