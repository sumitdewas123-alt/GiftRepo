/* Spec — Gallery 9: The Map of Memories. Old explorer aesthetic; pins open like envelopes;
 * greyed future pins (Japan, Iceland, Kerala again, Mountain café, Book fair) labelled "Reserved."
 * Secret: click every pin → the Memory Atlas unlocks. */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { mapPins, type MapPin } from "@/lib/museumData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const MAP_BG = "/manus-storage/world-map_77a0cc6a.png";

export default function Gallery9Map() {
  const [selected, setSelected] = useState<MapPin | null>(null);
  const [clicked, setClicked] = useState<Set<string>>(new Set());
  const [atlas, setAtlas] = useState(false);

  const openPin = (pin: MapPin) => {
    setSelected(pin);
    setClicked((prev) => {
      const next = new Set(prev);
      next.add(pin.id);
      if (!atlas && mapPins.every((p) => next.has(p.id))) {
        setAtlas(true);
        toast("📔 The Memory Atlas unlocks.", { description: "A leather notebook. Every location appears inside.", duration: 8000 });
      }
      return next;
    });
  };

  return (
    <RoomSection id="gallery-9" plaque="gallery nine" title="The Map of Memories" subtitle="Every story has a setting. Ours had many.">
      <div className="museum-frame relative mx-auto max-w-4xl overflow-hidden">
        <img src={MAP_BG} alt="Vintage world map with memory pins" className="block w-full" />
        {mapPins.map((pin) => (
          <button
            key={pin.id}
            onClick={() => openPin(pin)}
            aria-label={`${pin.future ? "Future destination" : "Memory location"}: ${pin.place}`}
            className="group absolute -translate-x-1/2 -translate-y-full focus:outline-none"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <span
              className={`block text-2xl drop-shadow-md transition-transform duration-200 group-hover:scale-125 group-focus:scale-125 md:text-3xl ${pin.future ? "opacity-60 grayscale" : ""}`}
              style={{ animation: pin.future ? "none" : "floatSlow 4s ease-in-out infinite" }}
              aria-hidden="true"
            >
              📍
            </span>
            {clicked.has(pin.id) && <span className="absolute -right-1 -top-1 text-xs" aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
      <div className="mx-auto mt-6 flex max-w-4xl justify-center gap-8 font-body text-sm italic text-muted-foreground">
        <span>📍 where the story happened</span>
        <span className="opacity-60 grayscale">📍 places still waiting · Reserved.</span>
      </div>
      {atlas && (
        <div className="mx-auto mt-8 max-w-lg border border-[#8a6f3c]/50 bg-gradient-to-b from-[#4a3826] to-[#382a1a] p-6 text-center shadow-2xl" style={{ animation: "fadeUp 1s ease both" }} role="note" aria-label="The Memory Atlas">
          <p className="font-display text-xs tracking-[0.3em] text-[#c9a45c]">THE MEMORY ATLAS · UNLOCKED</p>
          <p className="mt-3 font-hand text-xl leading-snug text-[#e8cd8c]">A leather notebook. Every location you found, pressed between its pages — including the ones still waiting for their chapter.</p>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="paper-texture border-[oklch(0.72_0.09_80/50%)] bg-card">
          <DialogHeader>
            <DialogTitle className="room-title text-2xl">{selected?.place}</DialogTitle>
            <DialogDescription className="plaque mt-1 self-start">{selected?.date}</DialogDescription>
          </DialogHeader>
          <p className="font-body leading-relaxed">{selected?.memory}</p>
          {selected?.future && <p className="font-hand text-xl text-[oklch(0.55_0.06_70)]">Museum label: Reserved.</p>}
        </DialogContent>
      </Dialog>
    </RoomSection>
  );
}
