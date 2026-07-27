/* Spec — Gallery 12: The Future Wing. Completely white, bright, only wind.
 * "Every museum preserves the past. This room preserves hope."
 * Unfinished labels + interactive wall (saved locally) + final blank frame. */
import { useEffect, useState } from "react";
import RoomSection from "@/components/RoomSection";
import { futureLabels, futureFrameLabel } from "@/lib/museumData";
import { toast } from "sonner";

interface FutureNote { id: string; text: string; }

export default function Gallery12Future() {
  const [notes, setNotes] = useState<FutureNote[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("moc-future-wall");
      if (raw) setNotes(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const next = [...notes, { id: `${Date.now()}`, text }];
    setNotes(next);
    setDraft("");
    try { localStorage.setItem("moc-future-wall", JSON.stringify(next)); } catch { /* ignore */ }
    toast("🕊️ Pinned to the Future Wall.", { description: "Saved on this device only. The museum keeps it private.", duration: 5000 });
  };

  return (
    <RoomSection id="gallery-12" plaque="gallery twelve" title="The Future Wing" subtitle="Every museum preserves the past. This room preserves hope." tone="cream" className="!bg-[#fbfaf6] dark:!bg-[oklch(0.3_0.01_80)]">
      <p className="mb-8 text-center font-hand text-xl text-muted-foreground">everything here hasn't happened. yet. · only wind.</p>

      {/* Unfinished exhibit labels */}
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3">
        {futureLabels.map((f, i) => (
          <div key={f.title} className="border border-dashed border-[#b8a583] bg-white/60 p-5 text-center shadow-sm backdrop-blur-sm dark:bg-white/5" style={{ animation: `fadeUp 1s ease ${i * 0.08}s both` }}>
            <div className="mx-auto mb-3 flex h-16 w-full items-center justify-center border border-[#d8ccae] bg-[#f4f1e8] dark:bg-white/5" aria-hidden="true">
              <span className="font-hand text-sm text-[#b8a583]">empty</span>
            </div>
            <p className="font-display text-sm tracking-[0.1em] text-[oklch(0.4_0.04_75)] dark:text-[#e8cd8c]">{f.title}</p>
            <p className="plaque mx-auto mt-2 !text-[9px]">{f.status}</p>
          </div>
        ))}
      </div>

      {/* Interactive wall */}
      <div className="mx-auto mt-12 max-w-xl">
        <p className="gold-rule justify-center font-display text-xs tracking-[0.3em] text-[oklch(0.5_0.07_75)]">THE FUTURE WALL — WRITE SOMETHING THAT HASN'T HAPPENED YET</p>
        <form onSubmit={addNote} className="mt-5 flex gap-2">
          <label htmlFor="future-note" className="sr-only">Write a future idea, dream, trip, book, or goal</label>
          <input
            id="future-note"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={140}
            placeholder="a trip… a book… a dream… a plan…"
            className="flex-1 border border-[#b8a583] bg-white/80 px-4 py-3 font-body text-[oklch(0.3_0.02_65)] outline-none transition-colors focus:ring-2 focus:ring-ring dark:bg-white/10 dark:text-[#efe2c2]"
          />
          <button type="submit" className="border border-[#8a6f3c] px-6 py-3 font-display text-xs tracking-[0.2em] text-[oklch(0.5_0.07_75)] transition-all duration-200 hover:bg-[#c9a45c]/15 focus:outline-none focus:ring-2 focus:ring-ring active:scale-[0.97] dark:text-[#e8cd8c]">
            PIN IT
          </button>
        </form>
        {notes.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {notes.map((n, i) => (
              <p key={n.id} className="sticky-note max-w-[14rem] p-3 font-hand text-lg leading-snug" style={{ transform: `rotate(${(i % 5) - 2}deg)` }}>{n.text}</p>
            ))}
          </div>
        )}
        <p className="mt-3 text-center font-body text-xs italic text-muted-foreground">Saved locally. Not uploaded. The future stays yours.</p>
      </div>

      {/* Final frame */}
      <div className="mx-auto mt-12 max-w-sm text-center">
        <div className="museum-frame bg-white/70 p-8 dark:bg-white/5">
          <div className="mx-auto flex h-32 w-full items-center justify-center border border-[#d8ccae]" aria-hidden="true">
            <span className="font-hand text-base text-[#b8a583]">blank</span>
          </div>
          <p className="plaque mx-auto mt-4">{futureFrameLabel}</p>
        </div>
      </div>
    </RoomSection>
  );
}
