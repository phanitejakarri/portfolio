import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

// Animates every [data-r] child into place the first time the block scrolls into view.
export default function Reveal({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "section" | "ul" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const items = el.querySelectorAll<HTMLElement>("[data-r]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    items.forEach((i) => (i.style.opacity = "0"));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        animate(items, { opacity: [0, 1], translateY: [40, 0], duration: 1100, delay: stagger(80), ease: "outExpo" });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = Tag as "div";
  return (
    <T ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </T>
  );
}
