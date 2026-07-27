/* Spec — Final Cinematic Sequence: Leave Museum → corridor of frames (You laughed here…)
 * → museum wakes up → epilogue handwriting → post-credits Dear Chicko letter →
 * credits catalog cards → "For Another Day" envelope → Continue Writing.
 * Skippable per accessibility guidance. */
import { useEffect, useState } from "react";
import { corridorFrames, epilogueLines, postCreditsLetter, creditsCards } from "@/lib/museumData";

export default function LastExhibit({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"corridor" | "epilogue" | "letter" | "credits">("corridor");
  const [frameIdx, setFrameIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // corridor: advance frames
  useEffect(() => {
    if (phase !== "corridor") return;
    if (frameIdx >= corridorFrames.length) {
      const t = setTimeout(() => setPhase("epilogue"), 3000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setFrameIdx((i) => i + 1), 2400);
    return () => clearTimeout(t);
  }, [phase, frameIdx]);

  // epilogue: advance lines
  useEffect(() => {
    if (phase !== "epilogue") return;
    if (lineIdx >= epilogueLines.length) {
      const t = setTimeout(() => setPhase("letter"), 2200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLineIdx((i) => i + 1), 2600);
    return () => clearTimeout(t);
  }, [phase, lineIdx]);

  return (
    <div className={`fixed inset-0 z-[70] overflow-y-auto transition-colors duration-[2000ms] ${phase === "corridor" ? "bg-[#171208]" : "bg-[#faf7f0]"}`} role="dialog" aria-modal="true" aria-label="The final cinematic sequence">
      {showSkip && phase !== "credits" && (
        <button
          onClick={() => setPhase("credits")}
          className="fixed right-4 top-4 z-10 border border-current/30 px-4 py-2 font-display text-[10px] tracking-[0.25em] opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
          style={{ color: phase === "corridor" ? "#d8c9a5" : "#6b5426" }}
        >
          SKIP CINEMATIC →
        </button>
      )}

      {/* Phase 1 — corridor of frames */}
      {phase === "corridor" && (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">
          <p className="font-display text-xs tracking-[0.35em] text-[#c9a45c]/70">THE SHEETS HAVE DISAPPEARED. EVERY FRAME IS VISIBLE.</p>
          <div className="mt-10 flex min-h-[10rem] items-center justify-center">
            {frameIdx < corridorFrames.length ? (
              <div key={frameIdx} className="museum-frame bg-[#241a0e] px-12 py-10" style={{ animation: "fadeUp 1.6s cubic-bezier(0.23,1,0.32,1) both" }}>
                <p className="font-display text-[10px] tracking-[0.3em] text-[#c9a45c]">FRAME {frameIdx + 1}</p>
                <p className="mt-4 room-title text-2xl text-[#efe2c2] md:text-3xl">{corridorFrames[frameIdx]}</p>
              </div>
            ) : (
              <p className="max-w-md font-hand text-2xl leading-relaxed text-[#e8cd8c]" style={{ animation: "fadeIn 1.5s ease both" }}>
                these weren't exhibits.<br />they were reminders.
              </p>
            )}
          </div>
          <p className="mt-8 font-body text-sm italic text-[#d8c9a5]/50">the museum begins waking up… lights warmer… rain stops… sunlight in every room</p>
        </div>
      )}

      {/* Phase 2 — epilogue (fade to white, handwriting) */}
      {phase === "epilogue" && (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center" style={{ animation: "fadeIn 2s ease both" }}>
          <div className="min-h-[12rem] max-w-lg">
            {epilogueLines.slice(0, lineIdx + 1).map((line, i) => (
              <p
                key={line}
                className={`mb-4 font-hand leading-relaxed text-[#4a3c1a] ${i === epilogueLines.length - 1 ? "text-4xl text-[#8a6f3c]" : "text-2xl"}`}
                style={{ animation: "fadeUp 2s cubic-bezier(0.23,1,0.32,1) both" }}
              >
                {line}
              </p>
            ))}
          </div>
          <p className="mt-6 font-body text-xs italic text-[#8a7a5c]">no signature. she already knows who built it.</p>
        </div>
      )}

      {/* Phase 3 — post-credits letter */}
      {phase === "letter" && (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-16" style={{ animation: "fadeIn 1.5s ease both" }}>
          <div className="paper-texture max-w-xl border border-[#8a6f3c]/40 bg-[#f8f2e2] p-8 shadow-2xl md:p-10">
            {postCreditsLetter.map((para, i) =>
              /<[a-z][\s\S]*>/i.test(para) ? (
                <div
                  key={para.slice(0, 20)}
                  className={`mb-3 font-hand leading-relaxed text-[#4a3c1a] ${i === 0 || i >= postCreditsLetter.length - 2 ? "text-2xl" : "text-xl"} [&_blockquote]:border-l-2 [&_blockquote]:border-[#8a6f3c] [&_blockquote]:pl-3 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6`}
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ) : (
                <p key={para.slice(0, 20)} className={`mb-3 font-hand leading-relaxed text-[#4a3c1a] ${i === 0 || i >= postCreditsLetter.length - 2 ? "text-2xl" : "text-xl"}`}>
                  {para}
                </p>
              )
            )}
          </div>
          <button
            onClick={() => setPhase("credits")}
            className="mt-8 border border-[#8a6f3c] px-10 py-3 font-display text-xs tracking-[0.3em] text-[#6b5426] transition-all duration-200 hover:bg-[#c9a45c]/15 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:scale-[0.97]"
          >
            CONTINUE →
          </button>
        </div>
      )}

      {/* Phase 4 — credits catalog cards + envelope + Continue Writing */}
      {phase === "credits" && (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center" style={{ animation: "fadeIn 1.5s ease both" }}>
          <p className="font-display text-xs tracking-[0.35em] text-[#8a6f3c]">MUSEUM CATALOG</p>
          <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            {creditsCards.map((c, i) => (
              <div key={c.role} className={`border border-[#c9a45c]/50 bg-gradient-to-b from-[#f4e9ce] to-[#e8d9b5] p-5 text-left shadow-md ${i >= 3 ? "sm:col-span-2" : ""}`} style={{ animation: `fadeUp 1s ease ${i * 0.25}s both` }}>
                <p className="font-display text-[10px] tracking-[0.3em] text-[#8a6f3c]">{c.role.toUpperCase()}</p>
                <p className="mt-1 font-display text-lg italic text-[#4a3c1a]">{c.name}</p>
              </div>
            ))}
          </div>

          {/* For Another Day envelope */}
          <div className="mt-10">
            {!envelopeOpen ? (
              <button
                onClick={() => setEnvelopeOpen(true)}
                aria-label="A small optional envelope: For Another Day"
                className="group border border-[#8a6f3c]/50 bg-[#f6ecd4] px-10 py-6 shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
                style={{ animation: "fadeUp 1.5s ease 1.4s both" }}
              >
                <span className="text-2xl" aria-hidden="true">✉️</span>
                <p className="mt-1 font-hand text-xl text-[#5a4327]">For Another Day</p>
              </button>
            ) : (
              <div className="border border-[#8a6f3c]/40 bg-[#f8f2e2] px-10 py-8 shadow-xl" style={{ animation: "fadeUp 0.8s ease both" }} role="note">
                <span className="text-3xl" aria-hidden="true">🌸</span>
                <p className="mt-2 font-body text-xs italic text-[#8a7a5c]">inside: only a tiny pressed flower, and one sentence —</p>
                <p className="mt-3 font-hand text-2xl leading-snug text-[#4a3c1a]">"Keep making ordinary moments.<br />They seem to become exhibits somehow."</p>
              </div>
            )}
          </div>

          <p className="mt-8 max-w-md font-body italic leading-relaxed text-[#6b5c40]">
            The museum closes every evening. Fortunately… friendship doesn't.
          </p>
          <button
            onClick={onClose}
            className="mt-6 border-2 border-[#8a6f3c] px-12 py-4 font-display text-sm tracking-[0.3em] text-[#6b5426] transition-all duration-200 hover:bg-[#c9a45c]/15 hover:shadow-[0_0_30px_rgba(201,164,92,0.25)] focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:scale-[0.97]"
          >
            CONTINUE WRITING
          </button>
          <p className="mt-4 font-display text-[10px] tracking-[0.3em] text-[#8a7a5c]">THE SIGN OUTSIDE NOW READS: PERMANENT COLLECTION · STILL GROWING</p>
        </div>
      )}
    </div>
  );
}
