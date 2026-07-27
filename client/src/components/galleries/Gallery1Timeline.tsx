/* Spec — Gallery 1: The Girl I Met. Old school archive + study. Timeline drawers 2015→Today,
 * Memory 001–007 cards, Exhibit 01 portrait, hidden drawer note. */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { timeline, memoryCards, gallery1PortraitImage, gallery1DrawerNote } from "@/lib/museumData";

export default function Gallery1Timeline() {
  const [open, setOpen] = useState<string | null>(timeline[0].year);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <RoomSection id="gallery-1" plaque="gallery one" title="The Girl I Met" subtitle="Every friendship has a beginning. Most beginnings don't feel important while they're happening. This one didn't either." tone="parchment">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {/* Exhibit 01 — portrait */}
          <div className="museum-frame pinspot relative bg-background p-6 text-center md:p-8">
            {gallery1PortraitImage ? (
              <img src={gallery1PortraitImage} alt="Portrait — Before Either of Us Knew" className="mx-auto h-52 w-44 object-cover" />
            ) : (
              <div className="mx-auto flex h-52 w-44 items-center justify-center bg-gradient-to-br from-[#d9cbb0] to-[#b8a583] text-5xl" aria-label="Portrait placeholder — replace with a natural, smiling photograph of Chicko">
                🖼️
              </div>
            )}
            <p className="plaque mt-5">exhibit 01</p>
            <p className="mt-2 font-display text-xl italic">"Before Either of Us Knew."</p>
            <p className="mt-1 font-body text-sm italic text-muted-foreground">Not glamorous. Just natural. Smiling.</p>
          </div>

          {/* Memory cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {memoryCards.map((m, i) => (
              <div key={m.no} className="paper-texture relative border border-border bg-card p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5" style={{ transform: `rotate(${(i % 3) - 1}deg)` }}>
                <p className="font-display text-[10px] tracking-[0.3em] text-[oklch(0.6_0.08_78)]">{m.no.toUpperCase()}</p>
                <p className="mt-2 font-body text-sm italic leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Hidden drawer */}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            aria-expanded={drawerOpen}
            className="group w-full border border-[#8a6f3c]/50 bg-gradient-to-b from-[#4a3826] to-[#382a1a] p-4 text-left shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <p className="font-display text-xs tracking-[0.25em] text-[#c9a45c]">
              {drawerOpen ? "▾ THE DESK DRAWER, OPENED" : "▸ AN OLD DESK. PULL DRAWER."}
            </p>
            <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: drawerOpen ? "8rem" : "0", opacity: drawerOpen ? 1 : 0 }}>
              <p className="mt-3 bg-[#f6ecd4] p-4 font-hand text-xl leading-snug text-[#5a4327] shadow-inner">
                "{gallery1DrawerNote}"
              </p>
            </div>
          </button>
        </div>

        {/* Timeline wall */}
        <div className="relative border-l-2 border-[oklch(0.72_0.09_80/50%)] pl-8" role="list" aria-label="Timeline wall — years engraved">
          {timeline.map((t) => {
            const isOpen = open === t.year;
            return (
              <div key={t.year} className="relative mb-8" role="listitem">
                <span className="absolute -left-[2.6rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[oklch(0.72_0.09_80)] bg-background" aria-hidden="true">
                  <span className={`h-2 w-2 rounded-full transition-all duration-300 ${isOpen ? "bg-[oklch(0.72_0.09_80)] scale-125" : "bg-[oklch(0.72_0.09_80/40%)]"}`} />
                </span>
                <button
                  className="group flex w-full items-baseline gap-4 text-left focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setOpen(isOpen ? null : t.year)}
                  aria-expanded={isOpen}
                  aria-label={`Open drawer for ${t.year}`}
                >
                  <span className="font-display text-2xl font-semibold text-[oklch(0.6_0.08_78)]">{t.year}</span>
                  <span className="room-title text-xl transition-colors duration-200 group-hover:text-[oklch(0.6_0.08_78)]">{t.title}</span>
                </button>
                <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isOpen ? "28rem" : "0", opacity: isOpen ? 1 : 0 }}>
                  <div className="mt-3 max-w-lg border-l-2 border-[oklch(0.72_0.09_80/40%)] pl-4">
                    {t.image && (
                      <img src={t.image} alt={`${t.year} — ${t.title}`} className="mb-3 max-h-40 w-auto border border-[oklch(0.72_0.09_80/40%)] object-cover shadow-md" />
                    )}
                    <p className="font-body italic leading-relaxed text-muted-foreground">{t.text}</p>
                    <p className="mt-2 font-hand text-base text-[oklch(0.55_0.06_70)]">drawer contents: photos · chats · notes · songs · books from this year</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RoomSection>
  );
}
