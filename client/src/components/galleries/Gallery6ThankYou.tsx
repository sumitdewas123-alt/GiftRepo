/* Spec — Gallery 8: The Things I Never Remembered to Thank You For.
 * Sacred, quiet. 100 notes; oak-tree centerpiece idea rendered as note wall;
 * wax-sealed envelope finale after reading enough notes. */
import { useMemo, useState } from "react";
import RoomSection from "@/components/RoomSection";
import { thankYouNotes, gratitudeEnvelope } from "@/lib/museumData";

const noteColors = [
  "linear-gradient(160deg, #fdf3c0, #f7e8a2)",
  "linear-gradient(160deg, #fcd9c4, #f6c6a8)",
  "linear-gradient(160deg, #d6ecd2, #c1e0ba)",
  "linear-gradient(160deg, #d9e4f5, #c3d4ee)",
  "linear-gradient(160deg, #f5d9e4, #eec3d4)",
];

export default function Gallery8ThankYou() {
  const [seed] = useState(() => Math.random());
  const [shown, setShown] = useState(24);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const shuffled = useMemo(() => {
    const arr = [...thankYouNotes];
    let s = seed * 233280;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [seed]);

  const envelopeReady = shown >= 48;

  return (
    <RoomSection id="gallery-8" plaque="gallery eight" title="The Things I Never Remembered to Thank You For" subtitle="Huge handwritten words at the entrance say only: Thank you. Nothing else. Very quiet. Only soft wind." tone="parchment">
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [column-fill:balance]">
        {shuffled.slice(0, shown).map((note, i) => (
          <div
            key={note}
            className="relative mb-4 break-inside-avoid p-4 font-hand text-lg leading-snug text-[#4a3c1a] shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl md:text-xl"
            style={{ background: noteColors[i % noteColors.length], transform: `rotate(${((i * 7) % 5) - 2}deg)` }}
          >
            <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#a83226]/80 shadow-sm" aria-hidden="true" />
            {note}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        {shown < thankYouNotes.length && (
          <button
            onClick={() => setShown((n) => Math.min(n + 24, thankYouNotes.length))}
            className="border border-[#8a6f3c] px-8 py-3 font-display text-xs tracking-[0.25em] text-[oklch(0.5_0.07_75)] transition-all duration-200 hover:bg-[#c9a45c]/15 focus:outline-none focus:ring-2 focus:ring-ring active:scale-[0.97] dark:text-[#e8cd8c]"
          >
            READ MORE NOTES ({shown}/{thankYouNotes.length})
          </button>
        )}
      </div>

      {/* Sealed envelope finale */}
      <div className="mx-auto mt-12 max-w-lg text-center">
        {envelopeReady ? (
          !envelopeOpen ? (
            <button
              onClick={() => setEnvelopeOpen(true)}
              className="group mx-auto block focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="A final envelope, sealed with wax. Open it."
              style={{ animation: "fadeUp 1.5s ease both" }}
            >
              <div className="relative border border-[#8a6f3c]/60 bg-[#f6ecd4] px-14 py-10 shadow-xl transition-transform duration-300 group-hover:scale-105">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl" aria-hidden="true">🔴</span>
                <p className="mt-8 font-display text-xs tracking-[0.3em] text-[#8a6f3c]">THE LIGHTS BRIGHTEN. A FINAL ENVELOPE APPEARS.</p>
                <p className="mt-1 font-hand text-lg text-[#5a4327]">sealed with wax · open gently</p>
              </div>
            </button>
          ) : (
            <div className="paper-texture border border-[#8a6f3c]/50 bg-[#f8f2e2] p-8 text-left shadow-2xl" style={{ animation: "fadeUp 1s ease both" }} role="note">
              {gratitudeEnvelope.map((line) => (
                <p key={line.slice(0, 20)} className="mb-3 font-hand text-xl leading-relaxed text-[#4a3c1a]">{line}</p>
              ))}
            </div>
          )
        ) : (
          <p className="font-body italic text-muted-foreground">Keep reading. When you've read enough… the lights will brighten.</p>
        )}
      </div>

      <p className="mt-10 text-center font-body text-sm italic text-muted-foreground">
        Before leaving — a small plaque: <strong>The next room contains things that can't be preserved. Only revisited.</strong>
      </p>
    </RoomSection>
  );
}

