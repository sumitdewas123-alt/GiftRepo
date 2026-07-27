/* Gilded Archive — Archive Search: search "books", "chai", "fight", "birthday"… */
import { useMemo, useState } from "react";
import { buildSearchIndex } from "@/lib/museumData";
import { Search, X } from "lucide-react";

export default function ArchiveSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const index = useMemo(() => buildSearchIndex(), []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    return index.filter(
      (it) =>
        it.keywords.some((k) => k.includes(query) || query.includes(k)) ||
        it.title.toLowerCase().includes(query) ||
        it.snippet.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [q, index]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Archive Search"
        className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2.5 font-display text-xs tracking-[0.2em] text-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring active:scale-95"
      >
        <Search size={14} /> ARCHIVE SEARCH
      </button>
      {open && (
        <div className="fixed inset-0 z-[65] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Archive Search">
          <div className="paper-texture w-full max-w-xl border border-[oklch(0.72_0.09_80/50%)] bg-card shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ animation: "fadeUp 0.3s cubic-bezier(0.23,1,0.32,1) both" }}>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Search size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                autoFocus
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                placeholder='Search the archive… try "books", "chai", "fight", "birthday"'
                aria-label="Search museum exhibits"
                className="w-full bg-transparent font-body text-lg outline-none placeholder:italic"
              />
              <button onClick={() => setOpen(false)} aria-label="Close search" className="shrink-0 p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {q.trim().length >= 2 && results.length === 0 && (
                <p className="p-4 font-body italic text-muted-foreground">The archive holds no record of that… yet. Try "chai", "rain", or "books".</p>
              )}
              {results.map((r) => (
                <a
                  key={r.id}
                  href={`#${r.galleryAnchor}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/50 p-4 transition-colors duration-150 last:border-0 hover:bg-accent"
                >
                  <p className="font-display text-[10px] tracking-[0.25em] text-[oklch(0.6_0.08_78)]">{r.gallery.toUpperCase()}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{r.title}</p>
                  <p className="mt-0.5 line-clamp-2 font-body text-sm italic text-muted-foreground">{r.snippet}</p>
                </a>
              ))}
              {q.trim().length < 2 && (
                <div className="p-4">
                  <p className="plaque mb-3">popular queries</p>
                  <div className="flex flex-wrap gap-2">
                    {["books", "chai", "fight", "birthday", "rain", "songs", "travel"].map((s) => (
                      <button key={s} onClick={() => setQ(s)} className="border border-border px-3 py-1.5 font-hand text-lg transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
