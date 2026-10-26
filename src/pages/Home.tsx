import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import VariableName from "@/components/VariableName";
import SplitFlap from "@/components/SplitFlap";
import Reveal from "@/components/Reveal";
import { TLink } from "@/components/Transition";
import { projects as allProjects, previewOf, stats, internships, leadership } from "@/lib/data";
import Scramble from "@/components/Scramble";
import { createHoverGL, type HoverGL } from "@/lib/hoverGL";

import { useCountUp, useInView } from "@/lib/hooks";

const roles = ["FULL-STACK DEV", "REACT + MERN", "GENAI BUILDER", "MS AT VIT MELB."];

function RoleFlap() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 3400);
    return () => clearInterval(t);
  }, []);
  return <SplitFlap text={roles[i]} length={16} size={window.innerWidth < 640 ? 17 : 24} delay={i === 0 ? 1400 : 0} />;
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-between px-5 md:px-10 pt-24 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 label text-mute">
        <span className="whitespace-nowrap">(G&apos;day — I&apos;m Phani)</span>
        <span className="hidden md:block text-center">Full-stack · 2.7 yrs · Melbourne, AU</span>
        <span className="text-right whitespace-nowrap">Open to new roles</span>
      </div>

      <VariableName
        lines={["PHANI", "TEJA KARRI"]}
        align={["text-[25vw] md:text-[19vw]", "text-right text-[15vw] md:text-[13.4vw] -mt-[0.04em]"]}
        className="uppercase leading-[0.84] tracking-[-0.02em] my-8 md:my-6 select-none"
      />

      <div className="grid md:grid-cols-3 gap-8 items-end">
        <p className="text-lg md:text-xl leading-snug max-w-[34ch]">
          I build and ship full-stack products, from React front ends and MERN back ends to Generative AI features, and I&apos;m now
          studying enterprise systems and business analytics.
        </p>
        <div className="md:justify-self-center">
          <div className="label text-mute mb-2">Currently</div>
          <RoleFlap />
        </div>
        <div className="md:justify-self-end flex flex-col items-start md:items-end gap-3">
          <span className="label text-mute hidden md:block">(Psst, hover my name)</span>
          <TLink to="/work" className="group inline-flex items-center gap-3 rounded-full border border-chalk/30 pl-6 pr-2 py-2 hover:bg-chalk hover:text-night transition-colors">
            See the work
            <span className="w-9 h-9 rounded-full bg-saffron text-night flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
          </TLink>
        </div>
      </div>
    </section>
  );
}

// Featured work as a stack of huge outlined names. Hovering one fills it, flips it like a
// split-flap and floats a WebGL screenshot after the cursor; clicking opens the case study.
function SelectedWork() {
  const featured = allProjects.filter((p) => p.featured);
  const [hover, setHover] = useState<string | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const gl = useRef<HoverGL | null>(null);

  useEffect(() => {
    if (!canvas.current || window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches) return;
    gl.current = createHoverGL(canvas.current, { w: 440, h: 275 });
    return () => gl.current?.destroy();
  }, []);
  useEffect(() => {
    const p = featured.find((q) => q.slug === hover);
    gl.current?.show(p ? previewOf(p) : null);
  }, [hover]);

  return (
    <section className="px-5 md:px-10 py-24 md:py-32 border-t border-edge">
      <div className="flex justify-between label text-mute mb-10 md:mb-14">
        <span>(Selected work)</span>
        <TLink to="/work" className="hover:text-saffron">
          All {String(allProjects.length).padStart(2, "0")} projects →
        </TLink>
      </div>

      <Reveal as="ul">
        {featured.map((p, i) => (
          <li key={p.slug} data-r onMouseLeave={() => setHover(null)}>
            <TLink
              to={`/work/${p.slug}`}
              onMouseEnter={() => setHover(p.slug)}
              className="group flex items-end justify-between gap-6 py-2 md:py-1"
            >
              <span
                className={`font-black semi uppercase text-[clamp(2.6rem,8.6vw,9rem)] leading-[0.92] tracking-[-0.035em] whitespace-nowrap transition-[color,opacity,-webkit-text-stroke-color] duration-500 ${
                  hover === p.slug ? "text-saffron" : "outline-text"
                } ${hover && hover !== p.slug ? "opacity-30" : ""}`}
              >
                <Scramble text={p.short} run={hover === p.slug} />
              </span>
              <span className="hidden md:flex flex-col items-end gap-1 pb-[1.2vw] shrink-0 text-right">
                <span className="font-mono text-sm text-saffron">({String(i + 1).padStart(2, "0")})</span>
                <span className="label text-mute">
                  {p.category} · {p.year}
                </span>
              </span>
            </TLink>
          </li>
        ))}
      </Reveal>

      <canvas ref={canvas} className="hidden lg:block fixed left-0 top-0 z-[60] pointer-events-none" aria-hidden />
    </section>
  );
}

function Stat({ s, run }: { s: (typeof stats)[number]; run: boolean }) {
  const v = useCountUp(s.value, run, s.decimals);
  return (
    <div data-r className="border-t border-edge pt-5">
      <div className="font-bold semi text-[clamp(2.6rem,5vw,4.5rem)] leading-none tabular-nums">
        {s.prefix === "+" ? "" : s.prefix}
        {v}
        <span className="text-saffron">{s.prefix === "+" ? "+" : s.suffix.replace(" / 10", "")}</span>
        {s.suffix.includes("/ 10") && <span className="text-mute text-[0.4em] ml-1 tracking-normal font-normal">/ 10</span>}
      </div>
      <div className="label text-mute mt-3">{s.label}</div>
    </div>
  );
}

const statement = [
  "I'm Phani, a full-stack developer with 2.7 years across Celestinfo, Amazon and freelance work.",
  "I turn *ideas and AI models* into *apps people can actually use.*",
];

function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [statsRef, statsOn] = useInView<HTMLDivElement>(0.3);
  useEffect(() => {
    const el = ref.current!;
    const words = el.querySelectorAll(".w");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    words.forEach((w) => ((w as HTMLElement).style.opacity = "0.12"));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        animate(words, { opacity: [0.12, 1], duration: 600, delay: stagger(28), ease: "outQuad" });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="px-5 md:px-10 py-24 md:py-32 border-t border-edge">
      <div className="grid md:grid-cols-[1fr_3fr] gap-8">
        <div className="label text-mute pt-3">(About)</div>
        <p ref={ref} className="text-[clamp(1.7rem,3.6vw,3.3rem)] leading-[1.12] tracking-[-0.015em] font-medium">
          {statement.map((line, li) => (
            // *starred* phrases are set in the italic serif
            <span key={li} className="block">
              {line.split("*").map((part, pi) =>
                part
                  .split(" ")
                  .filter(Boolean)
                  .map((w, wi) => (
                    <span key={`${pi}-${wi}`} className={`w ${pi % 2 ? "font-serif italic text-saffron font-normal" : ""}`}>
                      {w}{" "}
                    </span>
                  ))
              )}
            </span>
          ))}
        </p>
      </div>
      <div ref={statsRef}>
        <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-16 md:mt-20">
          {stats.map((s) => (
            <Stat key={s.label} s={s} run={statsOn} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function ExperienceTeaser() {
  const rows = [...internships, ...leadership].sort(
    (a, b) => Number(b.when.match(/\d{4}/)?.[0]) - Number(a.when.match(/\d{4}/)?.[0])
  );
  return (
    <section className="px-5 md:px-10 py-24 md:py-32 border-t border-edge">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <h2 className="font-bold semi text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9] tracking-[-0.02em]">
          Where I&apos;ve <span className="font-serif italic font-normal text-saffron">been</span>
        </h2>
        <TLink to="/experience" className="label hover:text-saffron">Full experience →</TLink>
      </div>
      <Reveal as="ul">
        {rows.map((e) => (
          <li data-r key={e.title + e.org}>
            <TLink
              to="/experience"
              className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[4rem_1.2fr_1.4fr_auto] items-center gap-x-5 md:gap-x-8 py-5 border-t border-edge"
            >
              {e.logo ? (
                <img src={e.logo} alt="" className="w-11 h-11 md:w-14 md:h-14 rounded-xl object-cover bg-chalk" />
              ) : (
                <span className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-panel border border-edge flex items-center justify-center font-serif italic text-2xl text-mute group-hover:text-saffron transition-colors duration-500">
                  {e.org[0]}
                </span>
              )}
              <span className="font-bold semi text-2xl md:text-4xl tracking-[-0.02em] transition-transform duration-500 ease-expo group-hover:translate-x-2">
                {e.org.split(",")[0]}
              </span>
              <span className="hidden md:block text-chalk/70">{e.title}</span>
              <span className="label text-mute text-right">{e.when}</span>
            </TLink>
          </li>
        ))}
      </Reveal>
    </section>
  );
}

function PostcardCTA() {
  return (
    <section className="px-5 md:px-10 py-24 md:py-36 border-t border-edge grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
      <div>
        <div className="label text-mute mb-6">(Say hello)</div>
        <h2 className="font-bold semi text-[clamp(2.6rem,6.5vw,6rem)] leading-[0.92] tracking-[-0.02em]">
          Got a role, a project, or a <span className="font-serif italic font-normal text-saffron">hard problem?</span>
        </h2>
        <TLink to="/contact" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-saffron text-night font-semibold pl-6 pr-2 py-2">
          Write me a postcard
          <span className="w-9 h-9 rounded-full bg-night text-saffron flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
        </TLink>
      </div>
      <TLink to="/contact" aria-label="Open the postcard" className="group relative block mx-auto w-full max-w-[420px] aspect-[1.55]">
        <span className="absolute inset-0 rounded-xl bg-card rotate-6 translate-x-4 translate-y-3 transition-transform duration-700 ease-expo group-hover:rotate-12 group-hover:translate-x-8" />
        <span
          className="absolute inset-0 rounded-xl overflow-hidden -rotate-3 transition-transform duration-700 ease-expo group-hover:rotate-0 group-hover:-translate-y-2 flex flex-col justify-between p-5"
          style={{ background: "repeating-conic-gradient(from 0deg at 50% 120%, #F2B544 0deg 6deg, #F6D27A 6deg 12deg)" }}
        >
          <span className="font-hand text-3xl text-ink -rotate-3">Greetings from</span>
          <span
            className="font-black wide text-[4.6rem] leading-none text-center text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(180deg,#E5432D 0 30%,#18A05E 30% 60%,#2E5BE6 60%)", WebkitTextStroke: "2px #161616" }}
          >
            MELB
          </span>
          <span className="label text-ink/70">Flip me →</span>
        </span>
      </TLink>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <SelectedWork />
      <ExperienceTeaser />
      <PostcardCTA />
    </>
  );
}
