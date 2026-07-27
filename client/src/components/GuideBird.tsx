/* Gilded Archive — the tiny museum guide bird. Appears occasionally, never intrusive. */
import { useEffect, useState } from "react";
import { birdFacts } from "@/lib/museumData";
import { useMuseum } from "@/contexts/MuseumContext";

export default function GuideBird() {
  const [visible, setVisible] = useState(false);
  const [fact, setFact] = useState("");
  const { toughGuyMode, entered } = useMuseum();

  useEffect(() => {
    if (!entered) return;
    let timer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    const schedule = (delay: number) => {
      timer = setTimeout(() => {
        const base = birdFacts[Math.floor(Math.random() * birdFacts.length)];
        setFact(toughGuyMode ? base.replace("Fun fact", "Tough-guy briefing").replace("Curator's note", "Tough-guy memo") : base);
        setVisible(true);
        hideTimer = setTimeout(() => {
          setVisible(false);
          schedule(30000 + Math.random() * 30000);
        }, 9000);
      }, delay);
    };
    schedule(14000);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, [entered, toughGuyMode]);

  return (
    <div
      className={`fixed bottom-20 right-4 z-50 max-w-[16rem] transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative border border-border bg-card/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-start gap-3">
          <img src="/manus-storage/logo-bird_bdea2d3a.png" alt="" className="h-9 w-9 shrink-0" style={{ animation: "floatSlow 3s ease-in-out infinite" }} />
          <div>
            <p className="font-display text-[10px] tracking-[0.25em] text-muted-foreground">MUSEUM GUIDE</p>
            <p className="mt-1 font-hand text-lg leading-snug text-foreground">{visible ? fact : ""}</p>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss guide"
          className="absolute right-1.5 top-1.5 px-1.5 text-xs text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
