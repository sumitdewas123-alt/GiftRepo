/*
 * THE MUSEUM OF CHICKO — MuseumCorridor
 * A physical transition space between galleries.
 * Each corridor is a unique architectural zone with environmental storytelling,
 * warm lighting, dust motes, wooden floors, and hidden details.
 *
 * The visitor should feel like they're walking through a real building.
 */
import { useEffect, useRef, useState, useCallback } from "react";

/* ---------- Shared architectural sub-components ---------- */

function WoodenFloor() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
      style={{
        background: `
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent calc(12.5% - 1px),
            oklch(0.25 0.04 60 / 20%) calc(12.5% - 1px),
            oklch(0.25 0.04 60 / 20%) 12.5%
          ),
          linear-gradient(180deg, oklch(0.28 0.04 60 / 60%), oklch(0.22 0.03 60 / 80%))
        `,
        boxShadow: "inset 0 8px 24px oklch(0.15 0.03 60 / 50%)",
        maskImage: "linear-gradient(180deg, transparent, oklch(0 0 0 / 80%))",
      }}
      aria-hidden="true"
    />
  );
}

function OverheadLight({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
      style={{
        width: "60%",
        height: "70%",
        background: "radial-gradient(ellipse 50% 40% at 50% 0%, oklch(0.85 0.12 85 / 18%), transparent 70%)",
        animation: `flicker ${7 + Math.random() * 3}s infinite ${delay}s`,
      }}
      aria-hidden="true"
    />
  );
}

function ArchedDoorway({ direction = "top" }: { direction?: "top" | "bottom" }) {
  const isTop = direction === "top";
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${isTop ? "top-0" : "bottom-0"} h-[40%]`}
      style={{
        background: isTop
          ? `linear-gradient(180deg, oklch(0.18 0.03 60 / 70%), transparent)`
          : `linear-gradient(0deg, oklch(0.18 0.03 60 / 70%), transparent)`,
        maskImage: isTop
          ? "radial-gradient(ellipse 40% 60% at 50% 100%, oklch(0 0 0 / 80%), transparent 70%)"
          : "radial-gradient(ellipse 40% 60% at 50% 0%, oklch(0 0 0 / 80%), transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}

function WallFrame({ text, rotation = 0, size = "sm", note }: { text: string; rotation?: number; size?: "sm" | "md"; note?: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const h = size === "md" ? "h-20 w-28" : "h-16 w-22";
  return (
    <button
      onClick={() => setRevealed((v) => !v)}
      className={`group relative flex items-center justify-center border-4 border-[oklch(0.65_0.09_80)] bg-[#1a1410]/80 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#c9a45c] ${h}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label={revealed ? text : "A framed museum exhibit"}
    >
      <div className="pointer-events-none absolute inset-[3px] border border-[oklch(0.75_0.1_82/40%)]" />
      {!revealed ? (
                  <span className="font-display text-sm italic text-[oklch(0.7_0.08_78/70%)]" style={{ animation: "flicker 8s infinite" }}>
          {text.slice(0, 18)}...
        </span>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1d1710]/95 p-2" style={{ animation: "fadeIn 0.8s ease both" }}>
          <p className="font-hand text-base text-[oklch(0.85_0.08_85)] leading-snug">{text}</p>
        </div>
      )}
      {note && (
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c9a45c] text-[10px] text-[#241a0e] shadow-md" aria-hidden="true">
          i
        </span>
      )}
    </button>
  );
}

function MuseumSign({ text, subtext }: { text: string; subtext?: string }) {
  return (
    <div className="relative border border-[oklch(0.65_0.09_80/50%)] bg-gradient-to-b from-[#2a2015]/90 to-[#1d1710]/90 px-5 py-3 shadow-lg backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 border border-[oklch(0.75_0.1_82/20%)]" />
      <p className="font-display text-sm md:text-base tracking-[0.3em] text-[oklch(0.75_0.1_82)] uppercase">{text}</p>
      {subtext && <p className="mt-1 font-body text-sm italic text-[oklch(0.65_0.06_75)]">{subtext}</p>}
    </div>
  );
}

function DustMotes({ count = 12 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{ active: boolean }>({ active: true });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const w = (canvas.width = canvas.offsetWidth);
    const h = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.05 - Math.random() * 0.15,
      size: 0.6 + Math.random() * 1.4,
      alpha: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let t = 0;
    const draw = () => {
      if (!stateRef.current.active) return;
      t += 0.006;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.phase) * 0.06;
        p.y += p.vy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        const twinkle = 0.6 + 0.4 * Math.sin(t * 2 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 164, 92, ${p.alpha * twinkle * 0.7})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      stateRef.current.active = false;
      cancelAnimationFrame(raf);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true" />;
}

function WindowGlow({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute top-[15%] ${side === "left" ? "left-[5%]" : "right-[5%]"} h-[35%] w-[18%]`}
      aria-hidden="true"
    >
      <div
        className="h-full w-full rounded-sm"
        style={{
          background: `linear-gradient(135deg, oklch(0.82 0.08 85 / 25%), oklch(0.75 0.06 80 / 15%))`,
          boxShadow: `0 0 40px 15px oklch(0.82 0.08 85 / 12%), inset 0 0 20px 5px oklch(0.85 0.1 85 / 8%)`,
        }}
      />
      {/* Window frame bars */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-[oklch(0.3_0.03_60/40%)]" />
        <div className="absolute left-0 top-1/2 h-[2px] w-full bg-[oklch(0.3_0.03_60/40%)]" />
      </div>
    </div>
  );
}

function HiddenNote({ text, placement }: { text: string; placement: "left" | "right" | "center" }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className={`group absolute ${placement === "center" ? "left-1/2 -translate-x-1/2 bottom-[20%]" : placement === "left" ? "left-[3%] bottom-[35%]" : "right-[2%] bottom-[35%]"} z-20`}
      aria-label="A hidden note"
    >
      {!open ? (
        <span
          className="inline-block max-w-[8rem] rotate-[-2deg] truncate border border-[oklch(0.65_0.09_80/40%)] bg-[#f6ecd4]/80 px-3 py-1.5 font-hand text-xs text-[#5a4327] shadow-md transition-all duration-300 group-hover:rotate-[1deg] group-hover:shadow-lg"
        >
          {text.slice(0, 20)}...
        </span>
      ) : (
        <div
          className={`sticky-note absolute bottom-full mb-2 max-w-[18rem] min-w-[12rem] p-3 font-hand text-base leading-snug text-[#4a3c1a] ${placement === "right" ? "-right-4" : ""}`}
          style={{
            animation: "fadeUp 0.6s ease both",
            transform: `rotate(${Math.random() * 4 - 2}deg)`,
          }}
        >
          <p className="whitespace-normal">{text}</p>
          <button
            onClick={() => setOpen(false)}
            className="mt-2 text-xs underline opacity-60 focus:outline-none"
          >
            close
          </button>
        </div>
      )}
    </button>
  );
}

function Bench() {
  return (
    <div className="flex items-end gap-1 opacity-50" aria-hidden="true">
      <span className="text-3xl">🪑</span>
    </div>
  );
}

function Plant({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <span
      className={size === "lg" ? "text-4xl opacity-40" : "text-2xl opacity-30"}
      aria-hidden="true"
    >
      🌿
    </span>
  );
}

function OldLamp({ glow = true }: { glow?: boolean }) {
  return (
    <div className="relative" aria-hidden="true">
      <span className="text-2xl">🕯️</span>
      {glow && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "3rem",
            height: "3rem",
            background: "radial-gradient(circle, oklch(0.85 0.12 85 / 25%), transparent 70%)",
            animation: "flicker 6s infinite",
          }}
        />
      )}
    </div>
  );
}

function DirectionArrow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 opacity-60" aria-hidden="true">
      <span className="text-lg text-[oklch(0.6_0.08_78)]">→</span>
      <span className="font-display text-xs tracking-[0.2em] text-[oklch(0.55_0.06_70)] uppercase">{text}</span>
    </div>
  );
}

function BirdAppearance() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000 + Math.random() * 5000);
    const t2 = setTimeout(() => setVisible(false), 8000 + Math.random() * 4000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  if (!visible) return null;
  return (
    <div
      className="absolute right-[10%] top-[20%] z-20"
      style={{ animation: "fadeUp 2s ease both, floatSlow 4s ease-in-out infinite" }}
      aria-hidden="true"
    >
      <span className="text-2xl">🐦</span>
      <p className="font-hand text-xs text-[oklch(0.65_0.08_78/70%)] mt-0.5">peck peck</p>
    </div>
  );
}

/* ---------- Corridor variants (themed between specific galleries) ---------- */

interface CorridorProps {
  variant: string;
  direction?: "next" | "returning";
}

const CORRIDOR_CONFIG: Record<string, { name: string; items: React.ReactNode[]; note: string; sign: string; subSign?: string; frames: { text: string; rotation: number; size?: "sm" | "md" }[] }> = {
  "welcome-promenade": {
    name: "The Promenade",
    sign: "Permanent Collection",
    subSign: "All galleries lie ahead",
    frames: [
      { text: "Every friendship has a beginning", rotation: -1.5 },
      { text: "Ordinary moments become extraordinary", rotation: 1 },
      { text: "You were always the point", rotation: -0.5 },
    ],
    note: "A loose floorboard whispers: 'Walk slowly. The rooms are in no hurry.'",
    items: [<Bench />, <Plant size="lg" />, <OldLamp />],
  },
  "reading-nook": {
    name: "The Reading Corner",
    sign: "Quiet Zone",
    subSign: "Please whisper",
    frames: [
      { text: "Tuesdays with Morrie sits here", rotation: 2 },
      { text: "25 Chapters of You — returned never", rotation: -1 },
      { text: "Some pages turn themselves", rotation: 0.5 },
    ],
    note: "The Archivist left a bookmark: 'I was reading about you.'",
    items: [<Bench />, <OldLamp glow />, <Plant />],
  },
  "frame-gallery": {
    name: "The Gallery of Small Frames",
    sign: "In Memory Of",
    subSign: "Moments too small to name",
    frames: [
      { text: "That Tuesday afternoon", rotation: -2 },
      { text: "The first time you laughed here", rotation: 1.5 },
      { text: "A Tuesday nobody remembers", rotation: -0.5 },
    ],
    note: "One frame is empty on purpose. 'Some memories belong only to you.'",
    items: [<DirectionArrow text="Keep walking" />],
  },
  "curators-passage": {
    name: "The Curator's Passage",
    sign: "Staff Only",
    subSign: "Curator's note: I never closed this door",
    frames: [
      { text: "The map is not the territory", rotation: 1 },
      { text: "I wrote this for no one", rotation: -1.5 },
      { text: "Some corridors lead back", rotation: 0 },
    ],
    note: "A postcard reads: 'Some days I forget how to start.'",
    items: [<OldLamp />, <Plant />],
  },
  "acoustic-chamber": {
    name: "The Acoustic Chamber",
    sign: "Sound Resonates Here",
    subSign: "Listen to the walls",
    frames: [
      { text: "A song only two people know", rotation: -1 },
      { text: "The hum of a shared silence", rotation: 1 },
      { text: "Music is memory with rhythm", rotation: 0.5 },
    ],
    note: "The wall vibrates faintly. Someone was here recently.",
    items: [<Plant size="lg" />],
  },
  "garden-threshold": {
    name: "The Garden Threshold",
    sign: "Natural Light",
    subSign: "Step into the warmth",
    frames: [
      { text: "A Tuesday morning in sunlight", rotation: 2 },
      { text: "The garden grew while we talked", rotation: -1 },
      { text: "Flowers bloom in conversation", rotation: 0.5 },
    ],
    note: "A pressed flower falls from somewhere above.",
    items: [<Plant size="lg" />, <Plant />, <Bench />],
  },
  "memory-hall": {
    name: "The Memory Hall",
    sign: "Pinned Memories",
    subSign: "Connected by invisible thread",
    frames: [
      { text: "This connects to that", rotation: -1.5 },
      { text: "String theory, but make it emotional", rotation: 1 },
      { text: "Every pin holds a Tuesday", rotation: -0.5 },
    ],
    note: "A red string connects two frames. 'These are the same day.'",
    items: [<DirectionArrow text="Follow the string" />],
  },
  "photo-gallery": {
    name: "The Photograph Antechamber",
    sign: "Moments in Silver",
    subSign: "Silver gelatin on archival paper",
    frames: [
      { text: "A photo that never existed", rotation: 1 },
      { text: "The best pictures are the ones you didn't take", rotation: -1 },
      { text: "This frame is empty on purpose", rotation: 0 },
    ],
    note: "A caption: 'You were beautiful that day. I forgot to tell you.'",
    items: [<OldLamp />, <Bench />],
  },
  "cartographers-corner": {
    name: "The Cartographer's Corner",
    sign: "Navigation Station",
    subSign: "All paths lead to Chicko",
    frames: [
      { text: "The map says: turn left at Tuesday", rotation: -2 },
      { text: "Compass reading: always north of you", rotation: 1.5 },
      { text: "Here be memory", rotation: -0.5 },
    ],
    note: "An old compass points somewhere it shouldn't.",
    items: [<DirectionArrow text="You are here" />],
  },
  "whispering-wall": {
    name: "The Whispering Wall",
    sign: "Whispers Only",
    subSign: "Press your ear to the wall",
    frames: [
      { text: "A voice says: keep going", rotation: 1 },
      { text: "The wall remembers everything", rotation: -1 },
      { text: "Whispered: 'I built this for you'", rotation: 0.5 },
    ],
    note: "If you listen carefully, the wall says your name.",
    items: [],
  },
  "observatory-entrance": {
    name: "The Observatory Entrance",
    sign: "Look Up",
    subSign: "The stars are waiting",
    frames: [
      { text: "A constellation named after Tuesday", rotation: -1.5 },
      { text: "The brightest star is a Tuesday", rotation: 1 },
      { text: "We mapped the sky together", rotation: 0 },
    ],
    note: "A telescope points at nothing. 'The best views are unseen.'",
    items: [<OldLamp glow={false} />],
  },
  "hidden-door": {
    name: "The Hidden Door",
    sign: "Restricted Access",
    subSign: "Not everyone finds this",
    frames: [
      { text: "A door that wasn't on the map", rotation: -1 },
      { text: "The key was always in the reading", rotation: 1.5 },
      { text: "Some rooms find you", rotation: 0.5 },
    ],
    note: "A tiny keyhole glows faintly. 'Curiosity is its own key.'",
    items: [<OldLamp />],
  },
  "final-approach": {
    name: "The Final Approach",
    sign: "Last Corridor",
    subSign: "One more room",
    frames: [
      { text: "You've walked the whole museum", rotation: -1 },
      { text: "The last room is always the hardest", rotation: 1 },
      { text: "Every corridor led here", rotation: 0 },
    ],
    note: "A single light at the end. 'Thank you for walking this far.'",
    items: [<Bench />, <Plant size="lg" />],
  },
  "exit-hall": {
    name: "The Exit Hall",
    sign: "You May Leave",
    subSign: "But the museum stays open",
    frames: [
      { text: "Coats may be left at the door", rotation: -1.5 },
      { text: "The mirror shows who you were", rotation: 1 },
      { text: "Visitors always return", rotation: -0.5 },
    ],
    note: "A farewell card: 'Come back anytime. The doors never lock.'",
    items: [<Bench />, <Plant />, <OldLamp glow />],
  },
};

export default function MuseumCorridor({ variant, direction = "next" }: CorridorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const config = CORRIDOR_CONFIG[variant];
  if (!config) return null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisible(true); }),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        minHeight: "14rem",
        background: `linear-gradient(180deg, oklch(0.22 0.03 60 / 95%), oklch(0.18 0.025 60 / 98%))`,
        borderBottom: "1px solid oklch(0.5 0.06 70 / 20%)",
        borderTop: "1px solid oklch(0.5 0.06 70 / 20%)",
      }}
      aria-label={`Museum corridor: ${config.name}`}
    >
      {/* Architectural layers */}
      <ArchedDoorway direction="top" />
      <ArchedDoorway direction="bottom" />
      <OverheadLight />
      <WoodenFloor />
      <WindowGlow side="left" />
      <WindowGlow side="right" />
      <DustMotes count={10} />
      <BirdAppearance />

      {/* Corridor content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 py-10 md:py-14"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 1.2s cubic-bezier(0.23,1,0.32,1), transform 1.2s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        {/* Corridor name plaque */}
        <p
          className="font-display text-xs tracking-[0.4em] text-[oklch(0.55_0.06_70)] uppercase opacity-50"
          style={{ animation: "fadeIn 2s ease 0.3s both" }}
        >
          {config.name}
        </p>

        {/* Museum sign */}
        <MuseumSign text={config.sign} subtext={config.subSign} />

        {/* Wall frames */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {config.frames.map((f, i) => (
            <WallFrame
              key={f.text}
              text={f.text}
              rotation={f.rotation}
              size={f.size}
              note={i === 1}
            />
          ))}
        </div>

        {/* Environmental items */}
        <div
          className="flex items-center gap-4"
          style={{ animation: "fadeIn 2.5s ease 0.8s both" }}
        >
          {config.items.map((item, i) => (
            <div
              key={i}
              className="transition-all duration-300"
              style={{ opacity: visible ? (hoveredItem === i ? 1 : 0.6) : 0 }}
              onMouseEnter={() => setHoveredItem(i)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Direction arrow */}
        {direction === "next" && (
          <div
            className="mt-2 flex items-center gap-2"
            style={{ animation: "fadeIn 3s ease 1.2s both" }}
          >
            <span className="text-lg text-[oklch(0.55_0.06_70/50%)]" aria-hidden="true">↓</span>
            <span className="font-display text-xs tracking-[0.3em] text-[oklch(0.5_0.05_70/40%)] uppercase">
              continue walking
            </span>
          </div>
        )}
      </div>

      {/* Hidden note */}
      <HiddenNote text={config.note} placement={variant.includes("hidden") ? "center" : "right"} />
    </div>
  );
}
