/*
 * THE MUSEUM OF CHICKO — MuseumFloorTransition
 * A thin visual transition strip that creates the illusion of walking
 * across different floor types between museum spaces.
 * Gallery floors → corridor floors → gallery floors.
 */
import { useEffect, useRef, useState } from "react";

interface FloorTransitionProps {
  type: "wood-to-cream" | "cream-to-wood" | "wood-to-dark" | "dark-to-wood" | "wood-to-walnut" | "walnut-to-wood";
}

export default function MuseumFloorTransition({ type }: FloorTransitionProps) {
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
    "wood-to-cream": "linear-gradient(90deg, oklch(0.28 0.04 60) 0%, oklch(0.28 0.04 60) 30%, oklch(0.55 0.06 80) 50%, oklch(0.93 0.025 85) 70%, oklch(0.93 0.025 85) 100%)",
    "cream-to-wood": "linear-gradient(90deg, oklch(0.93 0.025 85) 0%, oklch(0.93 0.025 85) 30%, oklch(0.55 0.06 80) 50%, oklch(0.28 0.04 60) 70%, oklch(0.28 0.04 60) 100%)",
    "wood-to-dark": "linear-gradient(90deg, oklch(0.28 0.04 60) 0%, oklch(0.28 0.04 60) 30%, oklch(0.55 0.06 80) 50%, oklch(0.2 0.02 60) 70%, oklch(0.2 0.02 60) 100%)",
    "dark-to-wood": "linear-gradient(90deg, oklch(0.2 0.02 60) 0%, oklch(0.2 0.02 60) 30%, oklch(0.55 0.06 80) 50%, oklch(0.28 0.04 60) 70%, oklch(0.28 0.04 60) 100%)",
    "wood-to-walnut": "linear-gradient(90deg, oklch(0.28 0.04 60) 0%, oklch(0.28 0.04 60) 30%, oklch(0.55 0.06 80) 50%, oklch(0.32 0.035 60) 70%, oklch(0.32 0.035 60) 100%)",
    "walnut-to-wood": "linear-gradient(90deg, oklch(0.32 0.035 60) 0%, oklch(0.32 0.035 60) 30%, oklch(0.55 0.06 80) 50%, oklch(0.28 0.04 60) 70%, oklch(0.28 0.04 60) 100%)",
  };

  return (
    <div
      ref={ref}
      className="h-[3px]"
      style={{
        background: bgMap[type] || bgMap["wood-to-cream"],
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
      aria-hidden="true"
    />
  );
}
