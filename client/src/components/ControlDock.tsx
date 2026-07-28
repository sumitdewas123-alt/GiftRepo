/*
 * Gilded Archive — visitor controls: day/night, rain, leaves, sound + volume,
 * plus room directory. Fixed, unobtrusive, keyboard accessible.
 */
import { useState } from "react";
import { useMuseum } from "@/contexts/MuseumContext";
import { soundEngine } from "@/lib/soundEngine";
import { Moon, Sun, CloudRain, Leaf, Volume2, VolumeX, Map as MapIcon, X } from "lucide-react";

const rooms = [
  { id: "gallery-1", label: "1 · The Girl I Met" },
  { id: "gallery-2", label: "2 · Things You Don't Notice" },
  { id: "gallery-3", label: "3 · The Evidence Room" },
  { id: "gallery-4", label: "4 · The Dance Studio" },
  { id: "gallery-5", label: "5 · The Sound Room" },
  { id: "gallery-6", label: "6 · Wall of Thank You" },
  { id: "gallery-7", label: "7 · The Little Things" },
  { id: "gallery-8", label: "8 · The Photo Room" },
  { id: "gallery-9", label: "9 · Map of Memories" },
  { id: "gallery-10", label: "10 · Compliment Machine" },
  { id: "gallery-11", label: "11 · Constellation Room" },
  { id: "gallery-12", label: "12 · The Hidden Room" },
  { id: "gallery-13", label: "13 · The Future Exhibit" },
  { id: "final-room", label: "· The Final Room" },
];

export default function ControlDock() {
  const m = useMuseum();
  const [dirOpen, setDirOpen] = useState(false);

  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/85 text-foreground shadow-md backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring active:scale-95";

  return (
    <>
      {/* Top-right controls */}
      <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-2" role="toolbar" aria-label="Museum ambience controls">
        <div className="flex gap-2">
          <button className={btn} aria-label={m.night ? "Switch to day mode" : "Switch to night mode"} title={m.night ? "Day mode" : "Night mode"} onClick={m.toggleNight}>
            {m.night ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className={`${btn} ${m.rain ? "!border-primary !bg-primary/20" : ""}`} aria-label={m.rain ? "Stop the rain" : "Let it rain"} aria-pressed={m.rain} title="Rain" onClick={() => { m.toggleRain(); soundEngine.setRain(!m.rain); }}>
            <CloudRain size={17} />
          </button>
          <button className={`${btn} ${m.leaves ? "!border-primary !bg-primary/20" : ""}`} aria-label={m.leaves ? "Stop falling leaves" : "Start falling leaves"} aria-pressed={m.leaves} title="Falling leaves" onClick={m.toggleLeaves}>
            <Leaf size={17} />
          </button>
          <button
            className={`${btn} ${m.soundOn ? "!border-primary !bg-primary/20" : ""}`}
            aria-label={m.soundOn ? "Mute museum sound" : "Play museum sound"}
            aria-pressed={m.soundOn}
            title="Sound"
            onClick={() => {
              if (m.soundOn) soundEngine.stop(); else soundEngine.start();
              m.toggleSound();
            }}
          >
            {m.soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </div>
        {m.soundOn && (
          <label className="flex items-center gap-2 rounded-full border border-border bg-card/85 px-3 py-1.5 shadow-md backdrop-blur-md">
            <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">VOL</span>
            <input
              type="range" min={0} max={1} step={0.05} value={m.volume}
              aria-label="Museum volume"
              className="h-1 w-20 accent-[#c9a45c]"
              onChange={(e) => { const v = Number(e.target.value); m.setVolume(v); soundEngine.setVolume(v); }}
            />
          </label>
        )}
      </div>

      {/* Directory toggle, bottom-left */}
      <button
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2.5 font-display text-xs tracking-[0.2em] text-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring active:scale-95"
        onClick={() => setDirOpen((v) => !v)}
        aria-expanded={dirOpen}
        aria-label="Museum directory"
      >
        {dirOpen ? <X size={14} /> : <MapIcon size={14} />} DIRECTORY
      </button>

      {dirOpen && (
        <nav
          className="fixed bottom-16 left-4 z-50 max-h-[60vh] w-64 overflow-y-auto border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-lg"
          aria-label="Museum rooms"
          style={{ animation: "fadeUp 0.25s cubic-bezier(0.23,1,0.32,1) both" }}
        >
          <p className="plaque mb-3 w-full text-center">floor plan</p>
          <ul className="space-y-0.5">
            {rooms.map((r) => (
              <li key={r.id}>
                <a
                  href={`#${r.id}`}
                  onClick={() => setDirOpen(false)}
                  className="block px-2 py-1.5 font-body text-sm text-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
                >
                  {r.label}
                  {r.id === "gallery-12" && !m.hiddenUnlocked && <span className="ml-2 text-xs opacity-60">🔒</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}

