import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { animate, stagger } from "animejs";
import { ArrowUpRight } from "lucide-react";
import { projects, repoUrl } from "@/lib/data";
import { repoName } from "@/lib/github";
import ArchDiagram from "@/components/ArchDiagram";
import Cover from "@/components/Cover";
import GitDiagramView from "@/components/GitDiagramView";
import { gitdiagrams } from "@/gitdiagrams";
import { TLink } from "@/components/Transition";
import Reveal from "@/components/Reveal";
import NotFound from "@/pages/NotFound";

function DiagramTabs({ p }: { p: (typeof projects)[number] }) {
  const gd = gitdiagrams[p.repos[0]];
  const [tab, setTab] = useState<"gitdiagram" | "map">("map");
  const tabs = [
    { id: "map" as const, label: "Interactive map" },
    ...(gd ? [{ id: "gitdiagram" as const, label: "GitDiagram" }] : []),
  ];
  return (
    <div className="mt-10">
      {tabs.length > 1 && (
        <div className="flex gap-2 mb-6" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full border px-4 py-1.5 text-[14px] transition-colors ${
                tab === t.id ? "bg-chalk text-night border-chalk" : "border-edge hover:border-chalk/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      {tab === "gitdiagram" && gd ? (
        <GitDiagramView repo={p.repos[0]} diagram={gd} />
      ) : (
        <div className="rounded-3xl border border-edge bg-panel/60 p-4 md:p-8">
          <ArchDiagram diagram={p.diagram} />
        </div>
      )}
    </div>
  );
}

export default function Project() {
  const { slug } = useParams();
  const i = projects.findIndex((p) => p.slug === slug);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    animate(titleRef.current.querySelectorAll(".t"), { translateY: ["105%", "0%"], duration: 1200, delay: stagger(40, { start: 100 }), ease: "outExpo" });
    animate(heroRef.current!, { clipPath: ["inset(18% 8% 18% 8% round 18px)", "inset(0% 0% 0% 0% round 18px)"], duration: 1600, delay: 300, ease: "outExpo" });
  }, [slug]);

  if (i < 0) return <NotFound />;
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const [hero, ...gallery] = p.photos;

  return (
    <>
      <section className="px-5 md:px-10 pt-28 md:pt-36">
        <div className="flex justify-between label text-mute">
          <TLink to="/work" className="hover:text-saffron">← All work</TLink>
          <span>
            Project <span className="text-saffron">{String(i + 1).padStart(2, "0")}</span> / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <h1 ref={titleRef} key={slug} className="mt-10 font-bold semi text-[clamp(2.8rem,8vw,8rem)] leading-[0.9] tracking-[-0.03em] max-w-[16ch]">
          {p.title.split(" ").map((w, j) => (
            <span key={j} className="mask mr-[0.22em]">
              <span className="t inline-block">{w}</span>
            </span>
          ))}
        </h1>

        <dl className="mt-14 grid grid-cols-2 md:grid-cols-[1fr_1fr_1.6fr_1.2fr] gap-8 border-t border-edge pt-6">
          <div>
            <dt className="label text-mute mb-3">Role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt className="label text-mute mb-3">Year · Type</dt>
            <dd>
              {p.year} · {p.category}
            </dd>
          </div>
          <div className="col-span-2 md:col-span-1">
            <dt className="label text-mute mb-3">Stack</dt>
            <dd className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full border border-edge px-3 py-1 text-[14px]">{t}</span>
              ))}
            </dd>
          </div>
          <div className="col-span-2 md:col-span-1">
            <dt className="label text-mute mb-3">Links</dt>
            <dd className="flex flex-col gap-1.5">
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-saffron w-fit">
                  {p.liveUrl.replace(/^https?:\/\//, "")} <ArrowUpRight size={15} />
                </a>
              )}
              {p.repos.map((r) => (
                <a key={r} href={repoUrl(r)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-saffron w-fit">
                  github/{r.includes("/") ? r : repoName(r)} <ArrowUpRight size={15} />
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      <div ref={heroRef} key={`h-${slug}`} className="px-5 md:px-10 mt-14">
        <Cover p={p} src={hero} className="aspect-[4/3] md:aspect-[16/8.5]" />
      </div>

      <Reveal className="px-5 md:px-10 py-24 md:py-36 grid md:grid-cols-[1fr_3fr] gap-8">
        <div data-r className="label text-mute pt-2">(Overview)</div>
        <p data-r className="text-[clamp(1.4rem,2.7vw,2.4rem)] leading-[1.22] tracking-[-0.01em]">{p.details}</p>
      </Reveal>

      <section className="px-5 md:px-10 pb-24 md:pb-36">
        <div className="grid md:grid-cols-[1fr_3fr] gap-8 border-t border-edge pt-8">
          <div className="label text-mute pt-2">(Architecture)</div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-bold semi text-[clamp(2rem,4.4vw,4rem)] leading-[0.92] tracking-[-0.02em]">
              How it&apos;s <span className="font-serif italic font-normal text-saffron">wired</span>
            </h2>
            <span className="label text-mute">Interactive map · GitDiagram</span>
          </div>
        </div>
        <DiagramTabs key={slug} p={p} />
      </section>

      <Reveal className="px-5 md:px-10 pb-24 md:pb-36 grid md:grid-cols-[1fr_3fr] gap-8">
        <div data-r className="label text-mute pt-2">(What I built)</div>
        <ol>
          {p.bullets.map((b, j) => (
            <li data-r key={b} className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[6rem_1fr] gap-4 border-t border-edge py-8 last:border-b">
              <span className="font-serif italic text-saffron text-4xl md:text-5xl leading-none">0{j + 1}</span>
              <span className="text-lg md:text-xl leading-snug">{b}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      {gallery.length > 0 && (
        <section className="px-5 md:px-10 pb-24 md:pb-36">
          <div className="label text-mute border-t border-edge pt-8 mb-10">(Screens)</div>
          <div className={`grid gap-6 ${gallery.length > 1 ? "md:grid-cols-2" : ""}`}>
            {gallery.map((src) => (
              <Cover key={src} p={p} src={src} className={gallery.length > 1 ? "aspect-[16/11]" : "aspect-[16/8.5]"} />
            ))}
          </div>
        </section>
      )}

      <TLink to={`/work/${next.slug}`} className="group block border-t border-edge px-5 md:px-10 py-16 md:py-24">
        <span className="label text-mute">Next project</span>
        <span className="mt-5 flex items-end justify-between gap-6">
          <span className="font-bold semi text-[clamp(2.4rem,6.5vw,6rem)] leading-[0.92] tracking-[-0.03em] max-w-[18ch] transition-colors group-hover:text-saffron">
            {next.title}
          </span>
          <span className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-full bg-saffron text-night text-3xl md:text-4xl flex items-center justify-center transition-transform duration-700 ease-expo group-hover:-rotate-45">
            →
          </span>
        </span>
      </TLink>
    </>
  );
}
