/*
 * THE MUSEUM OF CHICKO — MuseumWall
 * A thin decorative wall strip that sits between a corridor and a gallery.
 * Adds texture, warmth, and architectural continuity.
 * Think: wainscoting, baseboards, wall sconces, small plaques.
 */
import { useEffect, useRef, useState } from "react";

interface WallProps {
  variant: "warm" | "cool" | "dark" | "garden";
  quote?: string;
  plaque?: string;
}

export default function MuseumWall({ variant, quote, plaque }: WallProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisible(true); }),
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const bgMap: Record<string, string> = {
    warm: "linear-gradient(90deg, oklch(0.24 0.035 60), oklch(0.28 0.04 60), oklch(0.24 0.035 60))",
    cool: "linear-gradient(90deg, oklch(0.2 0.025 265), oklch(0.24 0.03 265), oklch(0.2 0.025 265))",
    dark: "linear-gradient(90deg, oklch(0.15 0.02 60), oklch(0.18 0.025 60), oklch(0.15 0.02 60))",
    garden: "linear-gradient(90deg, oklch(0.25 0.04 140), oklch(0.3 0.05 140), oklch(0.25 0.04 140))",
  };

  const sconceGlow = variant === "garden"
    ? "oklch(0.85 0.08 85 / 15%)"
    : "oklch(0.85 0.1 85 / 20%)";

  return (
    <div
      ref={ref}
      className="relative flex h-[4.5rem] items-center justify-center overflow-hidden"
      style={{
        background: bgMap[variant],
        borderBottom: `1px solid oklch(0.4 0.05 70 / 15%)`,
        borderTop: `1px solid oklch(0.4 0.05 70 / 10%)`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
      aria-hidden="true"
    >
      {/* Wall texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2rem, oklch(0 0 0 / 8%) 2rem, oklch(0 0 0 / 8%) 2.05rem)`,
        }}
      />

      {/* Wall sconce glows */}
      <div
        className="pointer-events-none absolute left-[15%] top-1/2 -translate-y-1/2"
        style={{
          width: "4rem",
          height: "4rem",
          background: `radial-gradient(circle, ${sconceGlow}, transparent 70%)`,
          animation: "flicker 8s infinite",
        }}
      />
      <div
        className="pointer-events-none absolute right-[15%] top-1/2 -translate-y-1/2"
        style={{
          width: "4rem",
          height: "4rem",
          background: `radial-gradient(circle, ${sconceGlow}, transparent 70%)`,
          animation: "flicker 9s infinite 1.5s",
        }}
      />

      {/* Quote or plaque text */}
      {quote && (
        <p
          className="relative z-10 font-hand text-sm italic text-[oklch(0.7_0.06_80/50%)]"
          style={{ animation: "fadeIn 2s ease 0.5s both" }}
        >
          "{quote}"
        </p>
      )}
      {plaque && (
        <p
          className="relative z-10 font-display text-[9px] tracking-[0.35em] text-[oklch(0.55_0.06_70/40%)] uppercase"
          style={{ animation: "fadeIn 2s ease 0.8s both" }}
        >
          {plaque}
        </p>
      )}
    </div>
  );
}
