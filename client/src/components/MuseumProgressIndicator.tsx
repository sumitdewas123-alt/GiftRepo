/*
 * THE MUSEUM OF CHICKO — MuseumProgressIndicator
 * A subtle, elegant progress indicator that shows how far through
 * the museum the visitor has walked. Feels like a museum floor plan
 * lighting up as you explore.
 *
 * Appears as a thin gold line at the top of the screen after entering.
 * Expands slightly when hovering to show room labels.
 */
import { useEffect, useRef, useState } from "react";

const ROOM_LABELS = [
  { id: "featured", label: "Featured" },
  { id: "gallery-1", label: "I" },
  { id: "gallery-2", label: "II" },
  { id: "gallery-3", label: "III" },
  { id: "gallery-4", label: "IV" },
  { id: "gallery-5", label: "V" },
  { id: "gallery-6", label: "VI" },
  { id: "gallery-7", label: "VII" },
  { id: "gallery-8", label: "VIII" },
  { id: "gallery-9", label: "IX" },
  { id: "gallery-10", label: "X" },
  { id: "gallery-11", label: "XI" },
  { id: "gallery-12", label: "XII" },
  { id: "gallery-13", label: "XIII" },
  { id: "final-room", label: "Final" },
];

export default function MuseumProgressIndicator() {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const main = document.getElementById("main");
      if (!main) return;
      const rect = main.getBoundingClientRect();
      const total = main.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(1, scrolled / total));
      setProgress(pct);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Museum progress"
    >
      {/* Progress bar track */}
      <div className="h-[3px] bg-[oklch(0.2_0.02_60/30%)]">
        <div
          ref={barRef}
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, oklch(0.72 0.09 80), oklch(0.85 0.12 85), oklch(0.72 0.09 80))",
            boxShadow: "0 0 8px oklch(0.85 0.1 85 / 40%)",
          }}
        />
      </div>

      {/* Expanded tooltip on hover */}
      <div
        className="overflow-hidden transition-all duration-500"
        style={{
          maxHeight: hovered ? "3rem" : "0",
          opacity: hovered ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-1 bg-[oklch(0.18_0.025_60/95%)] px-4 py-1.5 backdrop-blur-md">
          {ROOM_LABELS.map((room, i) => {
            const roomProgress = (i + 1) / ROOM_LABELS.length;
            const isActive = progress >= roomProgress;
            const isCurrent = progress >= roomProgress && progress < (i + 2) / ROOM_LABELS.length;
            return (
              <div
                key={room.id}
                className={`flex-1 text-center font-display text-[10px] tracking-[0.15em] transition-all duration-300 ${
                  isCurrent
                    ? "text-[oklch(0.85_0.12_85)] scale-110"
                    : isActive
                    ? "text-[oklch(0.6_0.08_78/60%)]"
                    : "text-[oklch(0.5_0.04_60/30%)]"
                }`}
              >
                {room.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
