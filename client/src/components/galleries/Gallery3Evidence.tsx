/* Spec — Gallery 4: The Evidence Room. Detective HQ: sections Books / Random Chats /
 * Voice Notes / Trips / Food / Great Debates + Laugh Counter + reserved glass case. */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { evidence, laughCounter, type Evidence } from "@/lib/museumData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const EVIDENCE_BG = "/manus-storage/evidence-room_a229d637.png";

const typeIcon: Record<Evidence["type"], string> = {
  photo: "🖼️", note: "📝", chat: "💬", meme: "😹", audio: "🎙️",
};

export default function Gallery4Evidence() {
  const [selected, setSelected] = useState<Evidence | null>(null);

  return (
    <RoomSection id="gallery-4" plaque="gallery four" title="The Evidence Room" subtitle="Every museum needs evidence." tone="walnut">
      <div
        className="relative min-h-[30rem] overflow-hidden rounded border-8 border-[#5a4327] shadow-2xl md:min-h-[36rem]"
        style={{ backgroundImage: `linear-gradient(rgba(60,44,24,0.35), rgba(60,44,24,0.45)), url(${EVIDENCE_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
        role="group"
        aria-label="Evidence board"
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {evidence.slice(0, -1).map((e, i) => {
            const next = evidence[i + 1];
            return (
              <line
                key={e.id}
                x1={`${parseFloat(e.pin.left) + 8}%`} y1={`${parseFloat(e.pin.top) + 8}%`}
                x2={`${parseFloat(next.pin.left) + 8}%`} y2={`${parseFloat(next.pin.top) + 8}%`}
                stroke="rgba(190, 60, 45, 0.75)" strokeWidth="1.5"
              />
            );
          })}
        </svg>
        {evidence.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelected(e)}
            className="group absolute focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
            style={{ top: e.pin.top, left: e.pin.left, transform: `rotate(${e.pin.rotate}deg)` }}
            aria-label={`Open evidence section: ${e.section}`}
          >
            <span className="absolute -top-1.5 left-1/2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[#a83226] shadow" aria-hidden="true" />
            <div className={`w-32 p-3 shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:shadow-2xl md:w-40 ${e.type === "note" ? "sticky-note" : "bg-[#f6efdd] text-[#3d3020]"}`}>
              <div className="text-2xl" aria-hidden="true">{typeIcon[e.type]}</div>
              <p className="mt-1 font-display text-[10px] tracking-[0.2em]">{e.section.toUpperCase()}</p>
              <p className={`mt-1 text-xs leading-snug md:text-sm ${e.type === "note" ? "font-hand text-base" : "font-body"}`}>{e.caption}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Laugh Counter */}
      <div className="mx-auto mt-10 max-w-3xl">
        <p className="gold-rule justify-center font-display text-xs tracking-[0.3em] text-[#c9a45c]">THE LAUGH COUNTER</p>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          {laughCounter.map((c) => (
            <div key={c.label} className="border border-[#c9a45c]/35 bg-[#241a0e]/80 p-4 text-center backdrop-blur-sm">
              <p className="font-display text-xl font-semibold text-[#e8cd8c]">{c.value}</p>
              <p className="mt-1 font-body text-xs italic text-[#d8c9a5]">{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Exhibit — reserved glass case */}
      <div className="mx-auto mt-10 max-w-md">
        <div className="relative border-2 border-[#c9a45c]/40 bg-gradient-to-b from-white/8 to-white/2 p-8 text-center shadow-inner backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" aria-hidden="true" />
          <p className="plaque !border-[#c9a45c]/40 !bg-transparent !text-[#c9a45c]">exhibit reserved</p>
          <p className="mt-4 font-body italic leading-relaxed text-[#d8c9a5]">For the memories we haven't accidentally collected yet.</p>
          <p className="mt-3 font-hand text-lg text-[#c9a45c]/80">the glass reflects the visitor. the next exhibit hasn't happened — she's still living it.</p>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="paper-texture border-[oklch(0.72_0.09_80/50%)] bg-card">
          <DialogHeader>
            <DialogTitle className="room-title text-2xl">{selected?.title}</DialogTitle>
            <DialogDescription className="font-hand text-xl text-[oklch(0.55_0.06_70)]">{selected?.caption}</DialogDescription>
          </DialogHeader>
          {selected?.image && (
            <img src={selected.image} alt={selected.title} className="max-h-64 w-full border border-[oklch(0.72_0.09_80/40%)] object-contain shadow-md" />
          )}
          <p className="font-body leading-relaxed">{selected?.context}</p>
          <p className="plaque mt-2 self-start">evidence · case no. 2015-∞</p>
        </DialogContent>
      </Dialog>
    </RoomSection>
  );
}

