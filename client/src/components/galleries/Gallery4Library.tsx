/* Spec — Gallery 5: The Library of Us. Doorway quote, reserved chairs, Books That
 * Found Us shelf, quote wall, hidden compartment note. */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { books, quoteWall, libraryHiddenNote, type Book } from "@/lib/museumData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMuseum } from "@/contexts/MuseumContext";

const LIBRARY_BG = "/manus-storage/library-room_435da104.png";

export default function Gallery5Library() {
  const [selected, setSelected] = useState<Book | null>(null);
  const [flippedQuote, setFlippedQuote] = useState<number | null>(null);
  const [pulls, setPulls] = useState(0);
  const { booksGlow } = useMuseum();

  const pullBook = (b: Book) => {
    setSelected(b);
    const n = pulls + 1;
    setPulls(n);
    if (n === 4) {
      toast("📜 A hidden compartment opens behind the shelf…", { description: `"${libraryHiddenNote}"`, duration: 9000 });
    }
  };

  return (
    <RoomSection id="gallery-5" plaque="gallery five" title="The Library of Us" subtitle={"Some people give you books. A few quietly rewrite chapters of your life."} bgImage={LIBRARY_BG}>
      {/* Reserved chairs */}
      <div className="mx-auto mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-4">
        <div className="border border-[#c9a45c]/40 bg-[#241a0e]/85 px-5 py-3 text-center backdrop-blur-sm">
          <span className="text-2xl" aria-hidden="true">🪑</span>
          <p className="mt-1 font-hand text-lg text-[#e8cd8c]">Reserved for Chicko</p>
        </div>
        <p className="max-w-[13rem] text-center font-hand text-lg text-[#d8c9a5]">"Some conversations are just books with two authors."</p>
        <div className="border border-[#c9a45c]/40 bg-[#241a0e]/85 px-5 py-3 text-center backdrop-blur-sm">
          <span className="text-2xl" aria-hidden="true">🪑</span>
          <p className="mt-1 font-hand text-lg text-[#e8cd8c]">Reserved for Weak Memory</p>
        </div>
      </div>

      {/* Shelf */}
      <div className="mx-auto max-w-3xl">
        <div className={`relative rounded-sm bg-[#3a2c18]/90 p-5 shadow-2xl backdrop-blur-sm transition-shadow duration-1000 md:p-8 ${booksGlow ? "shadow-[0_0_60px_rgba(201,164,92,0.6)]" : ""}`}>
          <p className="mb-4 text-center font-display text-sm tracking-[0.3em] text-[#c9a45c]">— BOOKS THAT FOUND US —</p>
          <div className="flex items-end justify-center gap-1.5 border-b-8 border-[#241a0e] pb-0 md:gap-2" role="list" aria-label="Interactive bookshelf">
            {books.map((b, i) => (
              <button
                key={b.id}
                role="listitem"
                onClick={() => pullBook(b)}
                aria-label={`Pull book: ${b.title}`}
                className="group relative flex flex-col items-center justify-end focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
                style={{ height: `${150 + (i % 3) * 22}px` }}
              >
                <div
                  className={`flex h-full w-9 items-center justify-center rounded-t-sm shadow-md transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-xl md:w-12 ${booksGlow ? "ring-2 ring-[#e8cd8c]" : ""}`}
                  style={{ backgroundColor: b.color, opacity: b.id === "bk-6" ? 0.45 : 1 }}
                >
                  <span className="font-display text-[10px] tracking-wider text-[#e8d9b5] md:text-xs" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
                    {b.title.length > 22 ? b.title.slice(0, 20) + "…" : b.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-center font-hand text-lg text-[#c9a45c]/80">pull a book from the shelf · one of them was never returned</p>
        </div>
      </div>

      {/* Quote wall */}
      <div className="mx-auto mt-10 max-w-4xl">
        <p className="gold-rule justify-center font-display text-xs tracking-[0.3em] text-[#c9a45c]">THE QUOTE WALL</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {quoteWall.map((q, i) => {
            const flipped = flippedQuote === i;
            return (
              <button
                key={q.quote}
                onClick={() => setFlippedQuote(flipped ? null : i)}
                aria-expanded={flipped}
                className="border border-[#c9a45c]/35 bg-[#241a0e]/85 p-4 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a45c] focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
                style={{ transform: `rotate(${(i % 3) - 1}deg)`, animation: `floatSlow ${6 + (i % 3)}s ease-in-out infinite` }}
              >
                {flipped ? (
                  <p className="font-body text-sm italic leading-relaxed text-[#d8c9a5]" style={{ animation: "fadeIn 0.5s ease both" }}>{q.why}</p>
                ) : (
                  <p className="font-hand text-lg leading-snug text-[#e8cd8c]">{q.quote}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg overflow-hidden border-[oklch(0.72_0.09_80/50%)] bg-[#f8f2e2] p-0 text-[#3d3020]">
          <div className="grid grid-cols-2" style={{ animation: "fadeUp 0.5s cubic-bezier(0.23,1,0.32,1) both" }}>
            <div className="border-r border-[#d8ccae] bg-gradient-to-r from-[#f4ecd8] to-[#efe6ce] p-6" style={{ animation: "pageTurn 0.7s cubic-bezier(0.23,1,0.32,1) both", transformOrigin: "right center" }}>
              <DialogHeader>
                <DialogTitle className="room-title text-xl leading-snug">{selected?.title}</DialogTitle>
                <DialogDescription className="plaque mt-2 !text-[10px]">{selected?.by}</DialogDescription>
              </DialogHeader>
              <p className="mt-4 font-body text-sm italic leading-relaxed">{selected?.note}</p>
            </div>
            <div className="bg-gradient-to-l from-[#f4ecd8] to-[#efe6ce] p-6">
              <p className="plaque mb-3 !text-[10px]">why it mattered</p>
              <p className="font-hand text-xl leading-relaxed text-[#5a4327]">{selected?.quote}</p>
              <div className="mt-6 h-14 w-8 bg-gradient-to-b from-[#a83226] to-[#8a2a20]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)" }} aria-hidden="true" title="bookmark: Weak Memory's current page" />
            </div>
          </div>
          <style>{`@keyframes pageTurn { from { transform: rotateY(-70deg); opacity: 0.3; } to { transform: rotateY(0); opacity: 1; } }`}</style>
        </DialogContent>
      </Dialog>
    </RoomSection>
  );
}
