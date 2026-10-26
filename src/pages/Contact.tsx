import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { Github, Linkedin, Phone, FileDown } from "lucide-react";
import { profile } from "@/lib/data";
import { resumePath } from "@/components/Nav";

const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

function Front({ onFlip }: { onFlip: () => void }) {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#F6D27A] [backface-visibility:hidden] flex flex-col justify-between p-5 md:p-8">
      <div className="absolute inset-0 opacity-60" style={{ background: "repeating-conic-gradient(from 0deg at 50% 120%, #F2B544 0deg 6deg, #F6D27A 6deg 12deg)" }} />
      <div className="absolute left-0 right-0 bottom-0 h-[30%] bg-blue" style={{ clipPath: "polygon(0 35%, 12% 20%, 25% 32%, 40% 15%, 55% 30%, 70% 18%, 85% 28%, 100% 12%, 100% 100%, 0 100%)" }} />
      <div className="absolute left-0 right-0 bottom-0 h-[18%] bg-[#1d3fa8]" style={{ clipPath: "polygon(0 40%, 15% 55%, 30% 38%, 50% 58%, 68% 40%, 85% 55%, 100% 35%, 100% 100%, 0 100%)" }} />
      <div className="relative font-hand text-[clamp(1.8rem,4.5vw,3.4rem)] text-ink -rotate-3 leading-none">Greetings from</div>
      <div className="relative text-center">
        <div
          className="font-black wide uppercase leading-[0.8] text-[clamp(4rem,15vw,10.5rem)] tracking-tight text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(180deg,#E5432D 0 25%,#FBF8F1 25% 30%,#18A05E 30% 55%,#FBF8F1 55% 60%,#2E5BE6 60% 100%)",
            WebkitTextStroke: "3px #161616",
            filter: "drop-shadow(6px 6px 0 #161616)",
          }}
        >
          Melb
        </div>
      </div>
      <div className="relative flex items-end justify-between text-card">
        <span className="label">Melbourne · 37.81°S 144.96°E</span>
        <button onClick={onFlip} className="label bg-ink text-card rounded-full px-4 py-2 hover:bg-red transition-colors">
          Flip to write ↻
        </button>
      </div>
    </div>
  );
}

function Back({ onFlip }: { onFlip: () => void }) {
  const [msg, setMsg] = useState("");
  const [from, setFrom] = useState("");
  const send = () => {
    const subject = `A postcard from ${from.trim() || "a visitor"}`;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
  };
  const ruled = { backgroundImage: "repeating-linear-gradient(transparent 0 37px, rgba(22,22,22,0.18) 37px 38px)", lineHeight: "38px" };

  return (
    <div className="absolute inset-0 rounded-2xl bg-card text-ink [backface-visibility:hidden] [transform:rotateY(180deg)] p-5 md:p-8 grid grid-rows-[1fr_auto] sm:grid-rows-1 sm:grid-cols-[1.15fr_1px_1fr] gap-4 md:gap-7">
      <div className="flex flex-col min-h-0">
        <div className="label text-mute mb-2">Your message</div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Hi Phani, we have a role / a project / a hard problem…"
          className="flex-1 min-h-0 resize-none bg-transparent font-hand text-[1.55rem] text-blue placeholder:text-ink/30 outline-none"
          style={ruled}
        />
        <div className="flex items-center gap-2 mt-2">
          <span className="font-hand text-2xl">—</span>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="your name"
            className="flex-1 bg-transparent font-hand text-[1.55rem] text-blue placeholder:text-ink/30 border-b border-ink/20 outline-none"
          />
        </div>
      </div>
      <div className="hidden sm:block bg-ink/15" />
      <div className="relative flex flex-col">
        <div className="hidden sm:flex justify-end">
          <div className="relative">
            <div
              className="w-20 h-24 md:w-24 md:h-28 bg-red p-1.5 rotate-2"
              style={{
                WebkitMask: "radial-gradient(circle 4px at 4px 4px, transparent 98%, #000) -4px -4px / 10px 10px",
                mask: "radial-gradient(circle 4px at 4px 4px, transparent 98%, #000) -4px -4px / 10px 10px",
              }}
            >
              <div className="w-full h-full border-2 border-card/80 flex flex-col items-center justify-center text-card">
                <span className="font-serif italic text-3xl leading-none">P</span>
                <span className="font-black cond text-lg leading-none mt-1">$1.70</span>
              </div>
            </div>
            <div className="stamp absolute -left-14 top-6 w-24 h-24 rounded-full border-2 border-ink/50 flex flex-col items-center justify-center text-ink/60 -rotate-12 font-mono text-[9px] leading-tight text-center">
              <span>MEL · AU</span>
              <span className="font-bold text-[11px] my-0.5">{today}</span>
              <span>POSTED WITH LOVE</span>
            </div>
          </div>
        </div>
        <div className="mt-auto font-hand text-[1.35rem] sm:text-[1.55rem] md:text-[1.7rem] border-t border-ink/15 sm:border-0 pt-2 sm:pt-0" style={ruled}>
          <div>{profile.name}</div>
          <div className="truncate">{profile.email}</div>
          <div>{profile.location}</div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-4">
          <button onClick={onFlip} className="label text-mute hover:text-ink">↻ Flip</button>
          <button onClick={send} className="rounded-full bg-ink text-card font-semibold px-5 py-2.5 hover:bg-red transition-colors">
            Post it →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    animate(titleRef.current!.querySelectorAll(".t"), { translateY: ["105%", "0%"], duration: 1200, delay: stagger(60, { start: 100 }), ease: "outExpo" });
    animate(cardRef.current!, { translateY: [120, 0], rotate: [-8, 0], opacity: [0, 1], duration: 1500, delay: 350, ease: "outExpo" });
  }, []);

  return (
    <div className="px-5 md:px-10 pt-28 md:pt-36 pb-24">
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 items-end mb-14">
        <h1 ref={titleRef} className="font-bold semi text-[clamp(3rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.03em]">
          {["Write", "me a"].map((w) => (
            <span key={w} className="mask mr-[0.2em]">
              <span className="t inline-block">{w}</span>
            </span>
          ))}
          <span className="mask">
            <span className="t inline-block font-serif italic font-normal text-saffron">postcard.</span>
          </span>
        </h1>
        <p className="text-lg text-chalk/70 max-w-[34ch]">
          Flip it over, write on it, and post it. It lands in my inbox through Gmail. Old-fashioned, but it works.
        </p>
      </div>

      <div className="mx-auto max-w-[980px] [perspective:2200px]">
        <div ref={cardRef} style={{ opacity: 0 }}>
          <div
            className="relative aspect-[3/4.4] sm:aspect-[1.55] transition-transform duration-[1000ms] ease-expo [transform-style:preserve-3d] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] rounded-2xl"
            style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
          >
            <Front onFlip={() => setFlipped(true)} />
            <Back onFlip={() => setFlipped(false)} />
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-[980px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Github, label: "GitHub", sub: "Code & READMEs", href: profile.github },
          { icon: Linkedin, label: "LinkedIn", sub: "Professional", href: profile.linkedin },
          { icon: Phone, label: "Call", sub: profile.phone, href: `tel:${profile.phone.replace(/[^+\d]/g, "")}` },
          { icon: FileDown, label: "Résumé", sub: "PDF, 1 page", href: resumePath, download: true },
        ].map(({ icon: Icon, label, sub, href, download }) => (
          <a
            key={label}
            href={href}
            target={download || href.startsWith("tel") ? undefined : "_blank"}
            rel="noopener noreferrer"
            download={download}
            className="group bg-panel border border-edge rounded-2xl p-5 flex flex-col gap-6 hover:border-saffron/60 hover:-translate-y-1 transition-all"
          >
            <Icon size={22} className="group-hover:text-saffron transition-colors" />
            <span>
              <span className="block font-bold semi text-xl">{label} ↗</span>
              <span className="label text-mute !text-[10px]">{sub}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
