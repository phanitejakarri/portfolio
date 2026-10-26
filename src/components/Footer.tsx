import { useLocation } from "react-router-dom";
import { profile } from "@/lib/data";
import { TLink } from "@/components/Transition";
import { pages } from "@/components/Nav";
import { scrollToId } from "@/lib/smooth";

export default function Footer() {
  const { pathname } = useLocation();
  if (pathname === "/work/deck") return null; // the deck is a full-screen page
  return (
    <footer className="border-t border-edge px-5 md:px-10 pt-14 pb-8">
      <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-10">
        <div>
          <a href={`mailto:${profile.email}`} className="font-bold semi text-[clamp(1.4rem,3vw,2.4rem)] tracking-[-0.02em] hover:text-saffron transition-colors break-all">
            {profile.email}
          </a>
          <div className="label text-mute mt-3">{profile.location}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="label text-mute mb-2">Pages</span>
          <TLink to="/" className="hover:text-saffron w-fit">Home</TLink>
          {pages.map((p) => (
            <TLink key={p.to} to={p.to} className="hover:text-saffron w-fit">{p.label}</TLink>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="label text-mute mb-2">Elsewhere</span>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-saffron w-fit">GitHub ↗</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-saffron w-fit">LinkedIn ↗</a>
          <a href={profile.codechef} target="_blank" rel="noopener noreferrer" className="hover:text-saffron w-fit">CodeChef ↗</a>
          <a href={profile.linktree} target="_blank" rel="noopener noreferrer" className="hover:text-saffron w-fit">Linktree ↗</a>
        </div>
      </div>
      <div className="mt-14 flex justify-between label text-mute">
        <span>© 2026 {profile.name}</span>
        <button onClick={() => scrollToId("top")} className="hover:text-chalk">Back to top ↑</button>
      </div>
    </footer>
  );
}
