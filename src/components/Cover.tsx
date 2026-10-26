import type { Project } from "@/lib/data";
import ArchDiagram from "@/components/ArchDiagram";
import { ghRepo } from "@/lib/github";

const host = (p: Project) => (p.liveUrl ? p.liveUrl.replace(/^https?:\/\//, "") : p.repos[0] ? `github.com/${ghRepo(p.repos[0])}` : "");

// A screenshot (or, with no screenshots, the architecture diagram) inside a minimal browser
// window that rises out of a softly tinted panel. `plain` drops the frame for small thumbnails.
export default function Cover({
  p,
  src = p.photos[0],
  className = "",
  plain = false,
}: {
  p: Project;
  src?: string;
  className?: string;
  plain?: boolean;
}) {
  const content = src ? (
    <img src={src} alt={`${p.title} screenshot`} loading="lazy" draggable={false} className="w-full h-full object-cover object-top" />
  ) : (
    <div className="w-full h-full flex items-center justify-center p-[6%] bg-[#141414]">
      <ArchDiagram diagram={p.diagram} compact className="w-full" />
    </div>
  );

  if (plain) return <div className={`relative overflow-hidden bg-panel ${className}`}>{content}</div>;

  return (
    <div
      className={`group/cover relative overflow-hidden rounded-2xl border border-edge ${className}`}
      style={{ background: `radial-gradient(120% 85% at 50% 0%, ${p.tint}2e, transparent 70%), #121212` }}
    >
      <div className="absolute left-[7%] right-[7%] top-[9%] -bottom-px flex flex-col rounded-t-lg overflow-hidden border border-b-0 border-chalk/10 bg-[#0f0f0f] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-expo group-hover:-translate-y-1.5">
        <div className="h-7 shrink-0 flex items-center justify-center border-b border-chalk/10 bg-[#1a1a1a]">
          <span className="max-w-[70%] truncate rounded-md bg-night/70 px-3 py-0.5 font-mono text-[10px] text-mute">{host(p)}</span>
        </div>
        <div className="relative flex-1 overflow-hidden">{content}</div>
      </div>
    </div>
  );
}
