import { useEffect, useMemo, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import type { DNode, Diagram, NodeKind } from "@/lib/diagrams";
import { fileUrl } from "@/lib/github";

const H = 58;
const W = 160;

export const KINDS: Record<NodeKind, { label: string; color: string }> = {
  client: { label: "UI", color: "#FFB547" },
  server: { label: "Server / API", color: "#7AA7FF" },
  data: { label: "Data", color: "#4CC38A" },
  code: { label: "Module", color: "#C0A8FF" },
  ext: { label: "External", color: "#F2765F" },
};

type Box = { x: number; y: number; w: number; h: number };
const box = (n: DNode): Box => ({ x: n.x, y: n.y, w: n.w ?? W, h: H });
const cx = (b: Box) => b.x + b.w / 2;
const cy = (b: Box) => b.y + b.h / 2;

type Side = "top" | "bottom" | "left" | "right";

// Lay out every edge as a cubic curve. Edges sharing one side of a node are spread
// out along that side so they never pile onto the same point.
function layout(d: Diagram) {
  const byId = new Map(d.nodes.map((n) => [n.id, box(n)]));
  const raw = d.edges.map((e, i) => {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const vertical = Math.abs(cy(b) - cy(a)) > 40;
    const down = cy(b) > cy(a);
    const right = cx(b) > cx(a);
    const sa: Side = vertical ? (down ? "bottom" : "top") : right ? "right" : "left";
    const sb: Side = vertical ? (down ? "top" : "bottom") : right ? "left" : "right";
    return { i, e, a, b, sa, sb, vertical };
  });

  const ports = new Map<string, { i: number; end: "a" | "b"; key: number }[]>();
  raw.forEach((r) => {
    const add = (id: string, side: Side, end: "a" | "b", other: Box) => {
      const k = `${id}:${side}`;
      const key = side === "top" || side === "bottom" ? cx(other) : cy(other);
      ports.set(k, [...(ports.get(k) ?? []), { i: r.i, end, key }]);
    };
    add(r.e.from, r.sa, "a", r.b);
    add(r.e.to, r.sb, "b", r.a);
  });
  const frac = new Map<string, number>();
  ports.forEach((list) => {
    list.sort((p, q) => p.key - q.key);
    list.forEach((p, j) => frac.set(`${p.i}${p.end}`, list.length === 1 ? 0.5 : 0.3 + (0.4 * j) / (list.length - 1)));
  });

  const point = (bx: Box, side: Side, f: number) => {
    if (side === "top") return [bx.x + bx.w * f, bx.y];
    if (side === "bottom") return [bx.x + bx.w * f, bx.y + bx.h];
    if (side === "left") return [bx.x, bx.y + bx.h * f];
    return [bx.x + bx.w, bx.y + bx.h * f];
  };

  return raw.map((r) => {
    const [sx, sy] = point(r.a, r.sa, frac.get(`${r.i}a`)!);
    const [ex, ey] = point(r.b, r.sb, frac.get(`${r.i}b`)!);
    const [c1x, c1y, c2x, c2y] = r.vertical ? [sx, (sy + ey) / 2, ex, (sy + ey) / 2] : [(sx + ex) / 2, sy, (sx + ex) / 2, ey];
    const mx = 0.125 * sx + 0.375 * c1x + 0.375 * c2x + 0.125 * ex;
    const my = 0.125 * sy + 0.375 * c1y + 0.375 * c2y + 0.125 * ey;
    return { ...r.e, d: `M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${ex},${ey}`, mx, my };
  });
}

function groupBox(d: Diagram, ids: string[]) {
  const bs = d.nodes.filter((n) => ids.includes(n.id)).map(box);
  const x0 = Math.min(...bs.map((b) => b.x)) - 14;
  const y0 = Math.min(...bs.map((b) => b.y)) - 30;
  const x1 = Math.max(...bs.map((b) => b.x + b.w)) + 14;
  const y1 = Math.max(...bs.map((b) => b.y + b.h)) + 14;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export { fileUrl, gitdiagramUrl } from "@/lib/github";

export default function ArchDiagram({ diagram, compact = false, className = "" }: { diagram: Diagram; compact?: boolean; className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const edges = useMemo(() => layout(diagram), [diagram]);
  const groups = useMemo(() => diagram.groups.map((g) => ({ ...g, ...groupBox(diagram, g.ids) })), [diagram]);

  const width = Math.max(...groups.map((g) => g.x + g.w), ...diagram.nodes.map((n) => n.x + (n.w ?? W))) + 16;
  const height = Math.max(...groups.map((g) => g.y + g.h), ...diagram.nodes.map((n) => n.y + H)) + 16;

  // draw the diagram in once it scrolls into view: groups, then boxes, then the wires
  useEffect(() => {
    const el = svg.current;
    if (!el || compact) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = el.querySelectorAll<SVGGElement>(".dn, .dg");
    const paths = el.querySelectorAll<SVGPathElement>(".de");
    const labels = el.querySelectorAll<SVGGElement>(".dl");
    nodes.forEach((n) => (n.style.opacity = "0"));
    labels.forEach((n) => (n.style.opacity = "0"));
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        animate(nodes, { opacity: [0, 1], duration: 700, delay: stagger(45), ease: "outQuad" });
        animate(paths, {
          strokeDashoffset: 0,
          duration: 900,
          delay: stagger(70, { start: 500 }),
          ease: "inOutQuad",
          onComplete: () => paths.forEach((p) => p.removeAttribute("style")),
        });
        animate(labels, { opacity: [0, 1], duration: 500, delay: stagger(70, { start: 1100 }) });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [compact, diagram]);

  const linked = (id: string) => !hover || hover === id || edges.some((e) => (e.from === hover && e.to === id) || (e.to === hover && e.from === id));
  const hoveredNode = diagram.nodes.find((n) => n.id === hover);

  return (
    <div className={className}>
      <div className={compact ? "" : "overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0"} data-lenis-prevent-horizontal>
        <svg
          ref={svg}
          viewBox={`0 0 ${width} ${height}`}
          className={`w-full h-auto ${compact ? "" : "min-w-[760px]"}`}
          role="img"
          aria-label="Architecture diagram"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill="#8B877F" />
            </marker>
            <marker id="arrow-hot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill="#FFB547" />
            </marker>
          </defs>

          {groups.map((g) => (
            <g key={g.label} className="dg">
              <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={14} fill="rgba(237,234,227,0.025)" stroke="#2A2A2A" strokeDasharray="5 5" />
              <text x={g.x + 14} y={g.y + 19} fill="#8B877F" fontSize={10.5} fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">
                {g.label.toUpperCase()}
              </text>
            </g>
          ))}

          {edges.map((e) => {
            const hot = hover && (e.from === hover || e.to === hover);
            return (
              <path
                key={`${e.from}-${e.to}`}
                className="de"
                d={e.d}
                fill="none"
                stroke={hot ? "#FFB547" : "#55524D"}
                strokeWidth={hot ? 1.8 : 1.3}
                opacity={hover && !hot ? 0.25 : 1}
                markerEnd={`url(#${hot ? "arrow-hot" : "arrow"})`}
              />
            );
          })}

          {diagram.nodes.map((n) => {
            const b = box(n);
            const k = KINDS[n.kind];
            const href = n.path ? fileUrl(n.repo ?? diagram.repo, n.path) : undefined;
            const body = (
              <g className="dn" style={{ cursor: href && !compact ? "pointer" : "default" }} onMouseEnter={() => !compact && setHover(n.id)}>
                <g style={{ opacity: linked(n.id) ? 1 : 0.3, transition: "opacity .3s" }}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={10} fill={`${k.color}14`} stroke={hover === n.id ? k.color : `${k.color}80`} strokeWidth={hover === n.id ? 1.6 : 1} />
                <rect x={b.x} y={b.y + 12} width={3} height={b.h - 24} rx={1.5} fill={k.color} />
                <text x={b.x + 14} y={b.y + (n.sub ? 25 : 34)} fill="#EDEAE3" fontSize={13.5} fontWeight={600} fontFamily="Archivo, sans-serif">
                  {n.label}
                </text>
                {n.sub && (
                  <text x={b.x + 14} y={b.y + 43} fill="#8B877F" fontSize={9.5} fontFamily="JetBrains Mono, monospace">
                    {n.sub}
                  </text>
                )}
                {href && !compact && (
                  <text x={b.x + b.w - 16} y={b.y + 18} fill={k.color} fontSize={11} opacity={hover === n.id ? 1 : 0}>
                    ↗
                  </text>
                )}
                </g>
              </g>
            );
            return href && !compact ? (
              <a key={n.id} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${n.label} source on GitHub`}>
                {body}
              </a>
            ) : (
              <g key={n.id}>{body}</g>
            );
          })}

          {!compact &&
            edges
              .filter((e) => e.label)
              .map((e) => {
                const w = e.label!.length * 5.9 + 12;
                const hot = hover && (e.from === hover || e.to === hover);
                return (
                  <g key={`l-${e.from}-${e.to}`} className="dl">
                    <g style={{ opacity: hover && !hot ? 0.2 : 1, transition: "opacity .3s" }}>
                    <rect x={e.mx - w / 2} y={e.my - 9} width={w} height={18} rx={9} fill="#0D0D0D" stroke={hot ? "#FFB547" : "#2A2A2A"} />
                    <text x={e.mx} y={e.my + 3.5} textAnchor="middle" fill={hot ? "#FFB547" : "#A9A49B"} fontSize={9.5} fontFamily="JetBrains Mono, monospace">
                      {e.label}
                    </text>
                    </g>
                  </g>
                );
              })}
        </svg>
      </div>

      {!compact && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(KINDS) as NodeKind[])
              .filter((k) => diagram.nodes.some((n) => n.kind === k))
              .map((k) => (
                <span key={k} className="label text-mute inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: KINDS[k].color }} />
                  {KINDS[k].label}
                </span>
              ))}
          </div>
          <span className="label text-mute truncate">
            {hoveredNode?.path ? (
              <span className="text-saffron">{`${hoveredNode.repo ?? diagram.repo}/${hoveredNode.path} ↗`}</span>
            ) : (
              "Hover a box · click to open its source"
            )}
          </span>
        </div>
      )}
    </div>
  );
}
