/*
 * THE MUSEUM OF CHICKO — MuseumMasonry
 * Architectural frame elements: columns, moldings, and entry arches
 * that create the feeling of passing through doorways between rooms.
 */
import { useEffect, useRef, useState } from "react";

interface MasonryProps {
  type: "arch-top" | "arch-bottom" | "column-pair" | "molding";
  label?: string;
}

export default function MuseumMasonry({ type, label }: MasonryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisible(true); }),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (type === "arch-top") {
    return (
      <div
        ref={ref}
        className="relative h-24 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, oklch(0.18 0.025 60 / 95%), oklch(0.22 0.03 60 / 85%))",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.5s ease",
        }}
        aria-hidden="true"
      >
        {/* Arch shape */}
        <div
          className="absolute inset-x-0 bottom-0 h-[80%]"
          style={{
            background: "radial-gradient(ellipse 35% 80% at 50% 100%, oklch(0.85 0.08 85 / 8%), transparent 60%)",
          }}
        />
        {/* Keystone */}
        <div className="absolute left-1/2 top-1 -translate-x-1/2">
          <div className="h-6 w-6 rounded-t-full border border-[oklch(0.6_0.08_78/40%)] bg-[oklch(0.3_0.04_60/60%)] shadow-md" />
        </div>
        {/* Column lines */}
        <div className="absolute bottom-0 left-[12%] h-[60%] w-[1px] bg-[oklch(0.5_0.06_70/25%)]" />
        <div className="absolute bottom-0 right-[12%] h-[60%] w-[1px] bg-[oklch(0.5_0.06_70/25%)]" />
        {/* Capital details */}
        <div className="absolute bottom-0 left-[10%] h-[2px] w-[6%] bg-[oklch(0.6_0.08_78/30%)]" />
        <div className="absolute bottom-0 right-[10%] h-[2px] w-[6%] bg-[oklch(0.6_0.08_78/30%)]" />
        {/* Label */}
        {label && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animation: "fadeIn 2s ease 0.5s both" }}>
            <p className="font-display text-[10px] tracking-[0.4em] text-[oklch(0.55_0.06_70/40%)] uppercase">
              {label}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (type === "arch-bottom") {
    return (
      <div
        ref={ref}
        className="relative h-20 overflow-hidden"
        style={{
          background: "linear-gradient(0deg, oklch(0.18 0.025 60 / 95%), oklch(0.22 0.03 60 / 85%))",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.5s ease",
        }}
        aria-hidden="true"
      >
        {/* Inverted arch glow */}
        <div
          className="absolute inset-x-0 top-0 h-[80%]"
          style={{
            background: "radial-gradient(ellipse 35% 80% at 50% 0%, oklch(0.85 0.08 85 / 6%), transparent 60%)",
          }}
        />
        {/* Floor line */}
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[oklch(0.5_0.06_70/20%)]" />
        {/* Baseboard */}
        <div className="absolute bottom-0 inset-x-0 h-[6px] bg-[oklch(0.3_0.04_60/30%)]" />
        {/* Column lines */}
        <div className="absolute top-0 left-[12%] h-[70%] w-[1px] bg-[oklch(0.5_0.06_70/25%)]" />
        <div className="absolute top-0 right-[12%] h-[70%] w-[1px] bg-[oklch(0.5_0.06_70/25%)]" />
      </div>
    );
  }

  if (type === "column-pair") {
    return (
      <div
        ref={ref}
        className="relative flex items-center justify-center py-4"
        style={{
          background: "linear-gradient(180deg, oklch(0.2 0.03 60 / 90%), oklch(0.22 0.03 60 / 95%))",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
        aria-hidden="true"
      >
        {/* Left column */}
        <div className="absolute left-[8%] top-0 bottom-0 w-[3px] bg-gradient-to-b from-[oklch(0.55_0.06_70/40%)] via-[oklch(0.45_0.05_65/30%)] to-[oklch(0.55_0.06_70/40%)]" />
        <div className="absolute left-[7%] top-0 bottom-0 w-[1px] bg-[oklch(0.6_0.08_78/20%)]" />
        {/* Right column */}
        <div className="absolute right-[8%] top-0 bottom-0 w-[3px] bg-gradient-to-b from-[oklch(0.55_0.06_70/40%)] via-[oklch(0.45_0.05_65/30%)] to-[oklch(0.55_0.06_70/40%)]" />
        <div className="absolute right-[7%] top-0 bottom-0 w-[1px] bg-[oklch(0.6_0.08_78/20%)]" />
        {/* Capital bases */}
        <div className="absolute left-[6%] top-0 h-[4px] w-[8%] bg-[oklch(0.55_0.06_70/30%)]" />
        <div className="absolute right-[6%] top-0 h-[4px] w-[8%] bg-[oklch(0.55_0.06_70/30%)]" />
        <div className="absolute left-[6%] bottom-0 h-[4px] w-[8%] bg-[oklch(0.55_0.06_70/30%)]" />
        <div className="absolute right-[6%] bottom-0 h-[4px] w-[8%] bg-[oklch(0.55_0.06_70/30%)]" />
      </div>
    );
  }

  // molding
  return (
    <div
      ref={ref}
      className="relative h-[6px]"
      style={{
        background: "linear-gradient(90deg, oklch(0.6_0.08_78/20%), oklch(0.7_0.09_82/35%), oklch(0.6_0.08_78/20%))",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
      aria-hidden="true"
    />
  );
}
