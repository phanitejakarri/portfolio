import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TLink } from "@/components/Transition";

export const pages = [
  { to: "/work", label: "Work" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
];

export const resumePath = "/projects/Phani_Teja_Karri_Resume.pdf";

export default function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const active = (to: string) => pathname === to || pathname.startsWith(to + "/");
  const link = (to: string) => (active(to) ? "text-chalk" : "text-chalk/60 hover:text-chalk transition-colors");

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[90] border-b transition-colors duration-300 ${
        scrolled || open ? "bg-night/90 backdrop-blur border-edge" : "border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-5 md:px-10 h-16">
        <TLink to="/" className="font-semibold text-[15px] tracking-tight">
          Phani Teja Karri
        </TLink>
        <nav className="hidden md:flex items-center gap-8 text-[14px]">
          {pages.map((p) => (
            <TLink key={p.to} to={p.to} className={link(p.to)}>
              {p.label}
            </TLink>
          ))}
          <a href={resumePath} download className="text-chalk/60 hover:text-chalk transition-colors">
            Résumé
          </a>
        </nav>
        <button className="md:hidden text-[14px] text-chalk/80" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col px-5 pb-4 text-[16px]">
          {[{ to: "/", label: "Home" }, ...pages].map((p) => (
            <TLink key={p.to} to={p.to} className={`py-2.5 border-t border-edge ${pathname === p.to || (p.to !== "/" && active(p.to)) ? "text-chalk" : "text-chalk/60"}`}>
              {p.label}
            </TLink>
          ))}
          <a href={resumePath} download className="py-2.5 border-t border-edge text-chalk/60">
            Résumé
          </a>
        </nav>
      )}
    </header>
  );
}
