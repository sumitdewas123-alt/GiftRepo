/* Gilded Archive — the visitor guestbook (localStorage persistence, static site) */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { toast } from "sonner";

interface Entry { name: string; note: string; date: string; }

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem("moc-guestbook");
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>(loadEntries);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    const entry: Entry = {
      name: name.trim() || "A Cherished Visitor",
      note: note.trim(),
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    };
    const next = [entry, ...entries].slice(0, 50);
    setEntries(next);
    try { localStorage.setItem("moc-guestbook", JSON.stringify(next)); } catch { /* ignore */ }
    setName("");
    setNote("");
    toast("📖 Your note has been added to the museum's permanent collection.");
  };

  return (
    <RoomSection id="guestbook" plaque="before you leave" title="The Guestbook" subtitle="Every museum asks its visitors to sign. This one especially." tone="parchment">
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        <form onSubmit={submit} className="museum-frame flex flex-col gap-4 bg-background p-6 md:p-8">
          <label htmlFor="gb-name" className="plaque self-start">your name (optional)</label>
          <input
            id="gb-name" type="text" value={name} maxLength={40}
            onChange={(e) => setName(e.target.value)}
            className="border border-input bg-card px-4 py-2.5 font-body outline-none focus:ring-2 focus:ring-ring"
            placeholder="Chicko, presumably"
          />
          <label htmlFor="gb-note" className="plaque self-start">your note</label>
          <textarea
            id="gb-note" value={note} maxLength={600} rows={5} required
            onChange={(e) => setNote(e.target.value)}
            className="resize-none border border-input bg-card px-4 py-2.5 font-hand text-xl outline-none focus:ring-2 focus:ring-ring"
            placeholder="Leave something for the museum to keep…"
          />
          <button type="submit" className="mt-2 border border-[#8a6f3c] px-8 py-3 font-display text-sm tracking-[0.25em] text-[oklch(0.5_0.07_75)] transition-all duration-200 hover:bg-[#c9a45c]/15 focus:outline-none focus:ring-2 focus:ring-ring active:scale-[0.97] dark:text-[#e8cd8c]">
            SIGN THE GUESTBOOK
          </button>
        </form>
        <div className="max-h-[26rem] space-y-4 overflow-y-auto pr-2" aria-live="polite" aria-label="Guestbook entries">
          {entries.length === 0 && (
            <p className="font-body italic text-muted-foreground">The first page is blank, waiting for you.</p>
          )}
          {entries.map((en, i) => (
            <blockquote key={`${en.date}-${i}`} className="sticky-note relative p-4" style={{ transform: `rotate(${(i % 3) - 1}deg)` }}>
              <p className="text-xl leading-snug">"{en.note}"</p>
              <footer className="mt-2 text-right text-base opacity-75">— {en.name}, {en.date}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </RoomSection>
  );
}
