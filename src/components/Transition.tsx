import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { animate, stagger } from "animejs";
import { resetScroll } from "@/lib/smooth";
import { projects } from "@/lib/data";

type Go = (to: string) => void;
const TransitionCtx = createContext<Go>(() => {});
const BARS = 6;

export function pageLabel(path: string) {
  if (path === "/") return "Home";
  if (path === "/work/deck") return "The Deck";
  if (path.startsWith("/work/")) return projects.find((p) => `/work/${p.slug}` === path)?.title ?? "Work";
  const name = path.slice(1).split("/")[0];
  return name ? name[0].toUpperCase() + name.slice(1) : "Home";
}

// Six bars rise in a staggered wave to cover the page, the route swaps,
// then they retreat upward to uncover the new one.
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const busy = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  const go = useCallback<Go>(
    (to) => {
      if (busy.current || to === pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        navigate(to);
        resetScroll();
        return;
      }
      busy.current = true;
      setLabel(pageLabel(to));
      setActive(true);
      requestAnimationFrame(() => {
        const bars = root.current!.querySelectorAll(".bar");
        const text = root.current!.querySelector(".bar-label");
        bars.forEach((b) => ((b as HTMLElement).style.transformOrigin = "50% 100%"));
        animate(bars, { scaleY: [0, 1], duration: 650, delay: stagger(55), ease: "inOutQuart" });
        animate(text!, { opacity: [0, 1], translateY: [40, 0], duration: 500, delay: 380, ease: "outExpo" }).then(() => {
          navigate(to);
          resetScroll();
          bars.forEach((b) => ((b as HTMLElement).style.transformOrigin = "50% 0%"));
          animate(text!, { opacity: 0, translateY: -30, duration: 350, delay: 120, ease: "inQuad" });
          animate(bars, { scaleY: [1, 0], duration: 700, delay: stagger(55, { start: 250 }), ease: "inOutQuart" }).then(() => {
            setActive(false);
            busy.current = false;
          });
        });
      });
    },
    [navigate, pathname]
  );

  // back/forward skips the animation but still lands at the top
  useEffect(() => {
    if (!busy.current) resetScroll();
  }, [pathname]);

  return (
    <TransitionCtx.Provider value={go}>
      {children}
      <div ref={root} aria-hidden className={`fixed inset-0 z-[140] pointer-events-none ${active ? "" : "invisible"}`}>
        <div className="absolute inset-0 flex">
          {Array.from({ length: BARS }, (_, i) => (
            <div key={i} className="bar flex-1 bg-saffron -mx-px" style={{ transform: "scaleY(0)" }} />
          ))}
        </div>
        <div className="bar-label absolute left-5 md:left-10 bottom-6 md:bottom-10 text-night opacity-0">
          <div className="label mb-3">Heading to</div>
          <div className="font-black text-[clamp(3rem,11vw,10rem)] leading-[0.85] tracking-[-0.03em] semi">{label}</div>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}

export function useGo() {
  return useContext(TransitionCtx);
}

export function TLink({
  to,
  children,
  className,
  ...rest
}: { to: string; children: React.ReactNode; className?: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const go = useGo();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
