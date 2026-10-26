import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { categories, projects, type Category } from "@/lib/data";
import { TLink } from "@/components/Transition";
import ProjectList from "@/components/ProjectList";

const count = (c: Category | "All") => (c === "All" ? projects.length : projects.filter((p) => p.category === c).length);

export default function Work() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = projects.filter((p) => filter === "All" || p.category === filter);

  useEffect(() => {
    if (!titleRef.current) return;
    animate(titleRef.current.querySelectorAll(".t"), { translateY: ["105%", "0%"], duration: 1200, delay: stagger(60, { start: 100 }), ease: "outExpo" });
  }, []);

  return (
    <>
      <section className="px-5 md:px-10 pt-28 md:pt-36 pb-12 md:pb-16">
        <div className="flex justify-between label text-mute">
          <span>(Work — {String(projects.length).padStart(2, "0")} projects)</span>
          <TLink to="/work/deck" className="hover:text-saffron">
            Browse as a 3D deck →
          </TLink>
        </div>
        <div className="mt-10 grid md:grid-cols-[1.6fr_1fr] gap-8 items-end">
          <h1 ref={titleRef} className="font-bold semi text-[clamp(3.2rem,10vw,9.5rem)] leading-[0.86] tracking-[-0.035em]">
            <span className="mask"><span className="t inline-block">Things</span></span>{" "}
            <span className="mask"><span className="t inline-block">I&apos;ve</span></span>{" "}
            <span className="mask">
              <span className="t inline-block font-serif italic font-normal text-saffron">built</span>
            </span>
          </h1>
          <p className="text-chalk/70 text-lg leading-snug max-w-[38ch] md:justify-self-end">
            Web apps, AI experiments and small tools. Hover a row for a preview; each case study has screenshots and an architecture
            diagram you can click through to the code.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-10 pb-24 md:pb-36">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-edge pt-6 mb-14">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-1.5 text-[14px] transition-colors ${
                  filter === c ? "bg-chalk text-night border-chalk" : "border-edge hover:border-chalk/50"
                }`}
              >
                {c} <span className={filter === c ? "text-night/50" : "text-mute"}>{String(count(c)).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <span className="label text-mute">Showing {String(shown.length).padStart(2, "0")}</span>
        </div>

        <ProjectList items={shown} />
      </section>
    </>
  );
}
