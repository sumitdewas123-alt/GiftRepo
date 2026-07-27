/* Spec — Gallery 3: The Things You Never Notice About Yourself.
 * 10 exact frames + secret "One More Thing" unlocked after opening every frame.
 * (File name kept for route continuity; rendered as gallery-3.) */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { observations, secretObservation } from "@/lib/museumData";

export default function Gallery3Observations() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<string | null>(null);
  const allOpened = observations.every((o) => openIds.has(o.id));

  const toggle = (id: string) => {
    setCurrent((c) => (c === id ? null : id));
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <RoomSection id="gallery-3" plaque="gallery three" title="The Things You Never Notice About Yourself" subtitle="A tiny handwritten sign at the entrance reads: Look closer.">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-5">
        {observations.map((o, i) => {
          const isOpen = current === o.id;
          const seen = openIds.has(o.id);
          return (
            <button
              key={o.id}
              onClick={() => toggle(o.id)}
              aria-expanded={isOpen}
              aria-label={`Open ${o.frame}`}
              className="group text-left focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
            >
              <div className={`museum-frame pinspot relative flex min-h-[10rem] flex-col bg-card p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl md:p-5 ${isOpen ? "scale-[1.03] shadow-2xl" : ""}`}>
                <p className="font-display text-[10px] tracking-[0.3em] text-[oklch(0.6_0.08_78)]">{o.frame.toUpperCase()} {seen && "✓"}</p>
                {isOpen ? (
                  <p className="mt-3 font-body text-sm italic leading-relaxed md:text-base" style={{ animation: "fadeIn 0.6s ease both" }}>{o.text}</p>
                ) : (
                  <p className="mt-auto pt-4 font-hand text-lg text-muted-foreground">look closer…</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Secret observation */}
      <div className="mx-auto mt-12 max-w-lg text-center">
        {allOpened ? (
          <div className="museum-frame bg-background p-8" style={{ animation: "fadeUp 1.2s cubic-bezier(0.23,1,0.32,1) both" }} role="note" aria-label="Secret observation unlocked">
            <p className="plaque">unlocked · the secret frame</p>
            <h3 className="room-title mt-4 text-2xl">{secretObservation.title}</h3>
            <p className="mt-3 font-body italic leading-relaxed text-muted-foreground">{secretObservation.text}</p>
          </div>
        ) : (
          <p className="font-hand text-xl text-muted-foreground">one more frame appears… after you've opened them all. ({openIds.size}/{observations.length})</p>
        )}
      </div>
    </RoomSection>
  );
}
