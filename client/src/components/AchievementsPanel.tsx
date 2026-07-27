/* Gilded Archive — visitor achievements badge case (bottom-right trigger) */
import { useState } from "react";
import { ACHIEVEMENTS, ROOM_IDS, useMuseum, type AchievementId } from "@/contexts/MuseumContext";
import { Award } from "lucide-react";

export default function AchievementsPanel() {
  const { achievements, visited } = useMuseum();
  const [open, setOpen] = useState(false);
  const ids = Object.keys(ACHIEVEMENTS) as AchievementId[];

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Achievements: ${achievements.size} of ${ids.length} earned`}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2.5 font-display text-xs tracking-[0.2em] text-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring active:scale-95"
      >
        <Award size={14} /> {achievements.size}/{ids.length}
      </button>
      {open && (
        <div
          className="fixed bottom-16 right-4 z-50 w-72 border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-lg"
          style={{ animation: "fadeUp 0.25s cubic-bezier(0.23,1,0.32,1) both" }}
          role="region" aria-label="Achievement badges"
        >
          <p className="plaque mb-3 w-full text-center">visitor badges</p>
          <ul className="space-y-3">
            {ids.map((id) => {
              const a = ACHIEVEMENTS[id];
              const earned = achievements.has(id);
              return (
                <li key={id} className={`flex items-start gap-3 ${earned ? "" : "opacity-45 grayscale"}`}>
                  <span className="text-2xl" aria-hidden="true">{a.icon}</span>
                  <div>
                    <p className="font-display text-sm font-semibold">{a.title} {earned && "✓"}</p>
                    <p className="font-body text-xs italic text-muted-foreground">{a.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 border-t border-border pt-2 text-center font-body text-xs italic text-muted-foreground">
            Rooms explored: {ROOM_IDS.filter((r) => visited.has(r)).length}/{ROOM_IDS.length}
          </p>
        </div>
      )}
    </>
  );
}
