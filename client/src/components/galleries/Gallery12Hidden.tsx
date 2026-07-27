/* Spec — Gallery 11: Letters Never Sent. The emotional heart. Almost empty room:
 * dark wood, rain outside, single desk, 12 wax-sealed envelopes with exact titles,
 * hidden drawer → blank letter: "The rest of the story still hasn't been written."
 * Also doubles as the password-protected hidden gallery (password: chicko). */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { letters, hiddenLetterText, hiddenGalleryPassword, type Letter } from "@/lib/museumData";
import { useMuseum } from "@/contexts/MuseumContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lock } from "lucide-react";


export default function Gallery11Letters() {
  const { hiddenUnlocked, unlockHidden, lettersRead, markLetterRead, award } = useMuseum();
  const [selected, setSelected] = useState<Letter | null>(null);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tryPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.trim().toLowerCase() === hiddenGalleryPassword.toLowerCase()) {
      unlockHidden("password accepted");
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const openLetter = (l: Letter) => {
    setSelected(l);
    markLetterRead(l.id);
    const next = new Set(lettersRead); next.add(l.id);
    if (letters.every((x) => next.has(x.id))) award("bookworm");
  };

  return (
    <RoomSection id="gallery-11" plaque="gallery eleven" title="Letters Never Sent" subtitle={hiddenUnlocked ? "Some words arrive too late. Some never needed to." : "This room is locked. The museum keeps some things safe."} tone="walnut">
      {!hiddenUnlocked ? (
        <div className="mx-auto max-w-md text-center">
          <div className="museum-frame bg-[#241a0e] p-10">
            <Lock className="mx-auto mb-4 text-[#c9a45c]" size={40} aria-hidden="true" />
            <p className="font-body italic leading-relaxed text-[#d8c9a5]">
              A heavy wooden door. A brass keyhole. A small plaque that reads:
            </p>
            <p className="mt-3 font-hand text-2xl text-[#e8cd8c]">
              "The key is the name this museum was built for."
            </p>
            <form onSubmit={tryPassword} className="mt-6 flex flex-col gap-3">
              <label htmlFor="hidden-pw" className="font-display text-xs tracking-[0.25em] text-[#c9a45c]">SPEAK THE PASSWORD</label>
              <input
                id="hidden-pw"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className={`border bg-[#170f08] px-4 py-3 text-center font-body text-[#efe2c2] outline-none transition-colors focus:ring-2 focus:ring-[#c9a45c] ${error ? "border-red-500" : "border-[#c9a45c]/50"}`}
                placeholder="whisper it here…"
                autoComplete="off"
              />
              <button type="submit" className="border border-[#c9a45c]/70 bg-[#c9a45c]/10 px-6 py-3 font-display text-sm tracking-[0.25em] text-[#e8cd8c] transition-all duration-200 hover:bg-[#c9a45c]/25 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:scale-[0.97]">
                TURN THE KEY
              </button>
              {error && <p className="font-body text-sm italic text-red-400" role="alert">The lock doesn't budge. Try again.</p>}
            </form>
            <p className="mt-4 font-body text-xs italic text-[#d8c9a5]/60">Hint: explorers may also find other ways in…</p>
          </div>
        </div>
      ) : (
        <>
          {/* The desk: 12 wax-sealed envelopes */}
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {letters.map((l, i) => {
              const read = lettersRead.has(l.id);
              return (
                <button
                  key={l.id}
                  onClick={() => openLetter(l)}
                  className="group relative border border-[#c9a45c]/40 bg-[#f6ecd4] p-5 pt-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
                  aria-label={`Open envelope: ${l.title}`}
                  style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
                >
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-2xl drop-shadow" aria-hidden="true">{read ? "📂" : "🔴"}</span>
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#e4d6b6] to-transparent" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }} aria-hidden="true" />
                  <p className="font-hand text-xl leading-snug text-[#5a4327]">{l.title}</p>
                  {read && <p className="mt-2 font-display text-[9px] tracking-[0.3em] text-[#8a6f3c]">— OPENED —</p>}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-center font-body text-sm italic text-[#d8c9a5]/80">
            Twelve envelopes. Wax sealed. They waited years; they can wait a few minutes more. ({lettersRead.size}/{letters.length} opened)
          </p>

          {/* Hidden drawer — final blank letter */}
          <div className="mx-auto mt-8 max-w-md">
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              aria-expanded={drawerOpen}
              className="w-full border border-[#8a6f3c]/50 bg-gradient-to-b from-[#4a3826] to-[#382a1a] p-4 text-left shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
            >
              <p className="font-display text-xs tracking-[0.25em] text-[#c9a45c]">
                {drawerOpen ? "▾ THE DESK DRAWER, OPENED" : "▸ THE DESK HAS ONE DRAWER. PULL IT."}
              </p>
              <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: drawerOpen ? "10rem" : "0", opacity: drawerOpen ? 1 : 0 }}>
                <div className="mt-3 bg-[#f6ecd4] p-5 shadow-inner">
                  <p className="font-display text-[10px] tracking-[0.3em] text-[#8a6f3c]">ONE FINAL ENVELOPE. NO TITLE. INSIDE — BLANK PAPER. ONLY ONE SENTENCE:</p>
                  <p className="mt-2 font-hand text-2xl text-[#5a4327]">"{hiddenLetterText}"</p>
                </div>
              </div>
            </button>
          </div>
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="paper-texture max-h-[85vh] overflow-y-auto border-[oklch(0.72_0.09_80/50%)] bg-[#f8f2e2] text-[#3d3020]">
          <DialogHeader>
            <DialogTitle className="font-hand text-3xl text-[#5a4327]">{selected?.title}</DialogTitle>
            <DialogDescription className="plaque self-start !text-[10px]">letters never sent · archive copy</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selected?.body.map((para) =>
              /<[a-z][\s\S]*>/i.test(para) ? (
                <div
                  key={para.slice(0, 20)}
                  className="font-hand text-xl leading-relaxed text-[#4a3c1a] [&_blockquote]:border-l-2 [&_blockquote]:border-[#8a6f3c] [&_blockquote]:pl-3 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ) : (
                <p key={para.slice(0, 20)} className="font-hand text-xl leading-relaxed text-[#4a3c1a]">{para}</p>
              )
            )}
            <p className="pt-2 text-right font-hand text-2xl text-[#5a4327]">— Weak Memory</p>
          </div>
        </DialogContent>
      </Dialog>
    </RoomSection>
  );
}
