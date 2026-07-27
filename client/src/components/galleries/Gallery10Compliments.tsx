/* Gilded Archive — Gallery 10: vintage compliment machine that prints tickets */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { compliments } from "@/lib/museumData";
import { soundEngine } from "@/lib/soundEngine";

export default function Gallery10Compliments() {
  const [printed, setPrinted] = useState<string[]>([]);
  const [printing, setPrinting] = useState(false);

  const generate = () => {
    if (printing) return;
    setPrinting(true);
    soundEngine.chime();
    const remaining = compliments.filter((c) => !printed.slice(-8).includes(c));
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setTimeout(() => {
      setPrinted((prev) => [...prev.slice(-4), pick]);
      setPrinting(false);
    }, 700);
  };

  return (
    <RoomSection id="gallery-10" plaque="gallery ten" title="The Compliment Machine" subtitle="Vintage model, 1900s. Never once printed a lie." tone="walnut">
      <div className="mx-auto max-w-md">
        {/* machine */}
        <div className="museum-frame relative bg-gradient-to-b from-[#4a3826] to-[#382a1a] p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c9a45c]/60 bg-[#241a0e] text-3xl shadow-inner" aria-hidden="true">
            ⚙️
          </div>
          <p className="font-display text-sm tracking-[0.35em] text-[#c9a45c]">AUTOMATIC COMPLIMENT DISPENSER</p>
          <p className="mt-1 font-hand text-lg text-[#d8c9a5]">insert nothing · receive everything</p>
          <button
            onClick={generate}
            disabled={printing}
            className="mt-6 w-full border-2 border-[#c9a45c] bg-[#c9a45c]/15 px-8 py-4 font-display text-lg tracking-[0.3em] text-[#e8cd8c] shadow-[0_4px_0_#8a6f3c] transition-all duration-150 hover:bg-[#c9a45c]/30 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:translate-y-1 active:shadow-none disabled:opacity-60"
          >
            {printing ? "PRINTING…" : "GENERATE"}
          </button>
          {/* slot */}
          <div className="mx-auto mt-6 h-2 w-3/4 rounded-full bg-[#170f08] shadow-inner" aria-hidden="true" />
        </div>
        {/* printed tickets */}
        <div className="mt-1 space-y-2" aria-live="polite">
          {printed.map((c, i) => (
            <div
              key={`${c}-${i}`}
              className="paper-texture mx-auto w-11/12 border border-dashed border-[#8a6f3c]/60 bg-[#f8f2e2] px-5 py-4 text-center shadow-md"
              style={{ animation: i === printed.length - 1 ? "printOut 0.7s cubic-bezier(0.23,1,0.32,1) both" : undefined }}
            >
              <p className="font-display text-[10px] tracking-[0.3em] text-[#8a6f3c]">OFFICIAL MUSEUM VERDICT</p>
              <p className="mt-1 font-hand text-2xl text-[#3d3020]">{c}</p>
            </div>
          ))}
          {printed.length === 0 && (
            <p className="pt-4 text-center font-body italic text-[#d8c9a5]/70">The machine hums, waiting for you to press the button.</p>
          )}
        </div>
      </div>
    </RoomSection>
  );
}
