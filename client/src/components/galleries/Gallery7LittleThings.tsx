/* Spec — Gallery 7: The Little Things Room. Cabinets: Tough Guy / Weak Memory /
 * Destiny / Reading Habit / Introvert / Trust (locked until enough rooms visited) + Random Drawer. */
import { useMemo, useState } from "react";
import RoomSection from "@/components/RoomSection";
import { cabinets, randomDrawerNotes } from "@/lib/museumData";
import { useMuseum } from "@/contexts/MuseumContext";

const COZY_BG = "/manus-storage/cozy-room_ed9c4251.png";

export default function Gallery7LittleThings() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [jarOpened, setJarOpened] = useState(false);
  const { visited } = useMuseum();
  const trustUnlocked = visited.size >= 6;
  const drawerNote = useMemo(() => randomDrawerNotes[Math.floor(Math.random() * randomDrawerNotes.length)], []);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <RoomSection id="gallery-7" plaque="gallery seven" title="The Little Things Room" subtitle={"People remember birthdays. They remember habits forever."} bgImage={COZY_BG}>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cabinets.map((cab) => {
          const isOpen = openId === cab.id;
          const locked = cab.locked && !trustUnlocked;
          return (
            <button
              key={cab.id}
              onClick={() => {
                if (locked) return;
                setOpenId(isOpen ? null : cab.id);
                if (cab.id === "cab-destiny" && !isOpen) setTimeout(() => setJarOpened(true), 1200);
              }}
              aria-expanded={isOpen}
              aria-disabled={locked}
              className={`group relative border border-[#c9a45c]/40 bg-[#241a0e]/85 p-5 text-left backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] ${locked ? "cursor-not-allowed opacity-70" : "hover:-translate-y-1 hover:border-[#c9a45c]"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110" aria-hidden="true">{locked ? "🔒" : cab.emoji}</span>
                <h3 className="font-display text-sm tracking-[0.12em] text-[#efe2c2]">{cab.label.toUpperCase()}</h3>
              </div>
              {locked ? (
                <p className="mt-3 font-hand text-lg text-[#c9a45c]/80">locked. keep walking through the museum… ({visited.size}/6 rooms)</p>
              ) : (
                <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isOpen ? "16rem" : "0", opacity: isOpen ? 1 : 0 }}>
                  <p className="mt-3 font-hand text-lg text-[#e8cd8c]">{cab.contents}</p>
                  <p className="mt-2 font-body text-sm italic leading-relaxed text-[#d8c9a5]">{cab.explanation}</p>
                  {cab.extra && (cab.id !== "cab-destiny" || jarOpened) && (
                    <p className="mt-3 border-t border-[#c9a45c]/30 pt-2 font-hand text-lg text-[#c9a45c]" style={{ animation: "fadeIn 1s ease both" }}>{cab.extra}</p>
                  )}
                </div>
              )}
              {!isOpen && !locked && <p className="mt-3 font-display text-[10px] tracking-[0.25em] text-[#c9a45c]/70">UNLOCK CABINET</p>}
            </button>
          );
        })}

        {/* Random Drawer */}
        <button
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
          className="group relative border border-dashed border-[#c9a45c]/50 bg-[#171208]/80 p-5 text-left backdrop-blur-sm transition-all duration-300 hover:border-[#c9a45c] focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">🗄️</span>
            <h3 className="font-display text-sm tracking-[0.12em] text-[#efe2c2]">THE RANDOM DRAWER</h3>
          </div>
          {drawerOpen ? (
            <p className="mt-3 font-hand text-xl text-[#e8cd8c]" style={{ animation: "fadeUp 0.6s ease both" }}>"{drawerNote}"</p>
          ) : (
            <p className="mt-3 font-body text-sm italic text-[#d8c9a5]">Every visit, this drawer holds a different observation. Open drawer.</p>
          )}
        </button>
      </div>
    </RoomSection>
  );
}
