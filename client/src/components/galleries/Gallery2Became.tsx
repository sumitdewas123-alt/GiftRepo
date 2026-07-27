/* Spec — Gallery 2: The Person You Became. Brighter room, four walls
 * (Reader / Dentist / Tough Guy / Quiet Strength) + interactive mirror. */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { becameWalls, mirrorLines } from "@/lib/museumData";

export default function Gallery2Became() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [mirrorText, setMirrorText] = useState<string | null>(null);

  return (
    <RoomSection id="gallery-2" plaque="gallery two" title="The Person You Became" subtitle="Time changes everyone. The beautiful part is seeing which pieces stayed.">
      <div className="grid gap-6 md:grid-cols-2">
        {becameWalls.map((w) => {
          const isOpen = openId === w.id;
          const isToughGuy = w.id === "wall-toughguy";
          return (
            <button
              key={w.id}
              onClick={() => setOpenId(isOpen ? null : w.id)}
              aria-expanded={isOpen}
              className="museum-frame pinspot group relative bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-ring md:p-8"
            >
              <p className="plaque">{w.subtitle.toLowerCase()}</p>
              {isToughGuy ? (
                <h3 className="room-title mt-4 text-2xl md:text-3xl">
                  <span className="line-through decoration-[#a83226] decoration-2 opacity-60">TOUGH GUY</span>
                  <span className="mt-1 block text-[oklch(0.6_0.08_78)]">Still Tough Guy.</span>
                </h3>
              ) : (
                <h3 className="room-title mt-4 text-2xl md:text-3xl">{w.title}</h3>
              )}
              <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isOpen ? "22rem" : "0", opacity: isOpen ? 1 : 0 }}>
                <div className="mt-4 space-y-2">
                  {w.lines.map((line) => (
                    <p key={line} className={`leading-relaxed ${isToughGuy ? "font-hand text-xl text-[oklch(0.5_0.06_70)]" : "font-body italic text-muted-foreground"}`}>{line}</p>
                  ))}
                  {w.closing && <p className="mt-3 font-display text-lg italic text-[oklch(0.55_0.07_75)]">{w.closing}</p>}
                </div>
              </div>
              {!isOpen && <p className="mt-4 font-display text-[10px] tracking-[0.25em] text-[oklch(0.6_0.08_78)]">LOOK CLOSER</p>}
            </button>
          );
        })}
      </div>

      {/* Interactive Mirror */}
      <div className="mx-auto mt-12 max-w-md text-center">
        <button
          onClick={() => setMirrorText(mirrorLines[Math.floor(Math.random() * mirrorLines.length)])}
          aria-label="An antique mirror — look into it"
          className="museum-frame group relative block w-full overflow-hidden bg-gradient-to-b from-[#cfc4ad] via-[#e4dbc6] to-[#b8ac92] p-8 shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,164,92,0.3)] focus:outline-none focus:ring-2 focus:ring-ring dark:from-[#3a3225] dark:via-[#4a4030] dark:to-[#2e271b]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" aria-hidden="true" />
          <p className="plaque">the antique mirror</p>
          <div className="mt-6 min-h-[6rem]">
            {mirrorText ? (
              <p key={mirrorText} className="font-hand text-2xl leading-snug text-[#4a3c1a] dark:text-[#e8cd8c]" style={{ animation: "fadeUp 0.8s ease both" }}>
                {mirrorText}
              </p>
            ) : (
              <p className="font-body italic text-muted-foreground">Instead of a reflection… it shows things you don't see in yourself. Look in.</p>
            )}
          </div>
        </button>
      </div>
    </RoomSection>
  );
}
