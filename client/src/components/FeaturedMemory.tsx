/* Gilded Archive — Today's Featured Memory (rotates daily) + Random Memory button */
import { useMemo, useState } from "react";
import { allMemories } from "@/lib/museumData";
import { Shuffle } from "lucide-react";

export default function FeaturedMemory() {
  const pool = useMemo(() => allMemories(), []);
  const todayIdx = useMemo(() => {
    const d = new Date();
    const dayNum = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
    return dayNum % pool.length;
  }, [pool.length]);
  const [randomIdx, setRandomIdx] = useState<number | null>(null);

  const featured = pool[todayIdx];
  const random = randomIdx !== null ? pool[randomIdx] : null;

  return (
    <section className="paper-texture bg-card py-20 text-card-foreground" aria-label="Featured memory">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Today's featured */}
          <div className="museum-frame pinspot relative bg-background p-8">
            <p className="plaque">today's featured memory</p>
            <h3 className="room-title mt-4 text-2xl md:text-3xl">{featured.title}</h3>
            <p className="mt-3 font-body italic leading-relaxed text-muted-foreground">{featured.text}</p>
            <a href={`#${featured.anchor}`} className="mt-4 inline-block font-display text-xs tracking-[0.25em] text-[oklch(0.6_0.08_78)] underline-offset-4 hover:underline">
              VISIT: {featured.gallery.toUpperCase()} →
            </a>
            <p className="mt-4 font-hand text-lg text-muted-foreground">a different memory is featured every day — come back tomorrow.</p>
          </div>
          {/* Random memory */}
          <div className="flex flex-col justify-center border border-dashed border-[oklch(0.72_0.09_80/50%)] bg-background/60 p-8 text-center">
            {random ? (
              <div style={{ animation: "fadeUp 0.5s cubic-bezier(0.23,1,0.32,1) both" }} key={randomIdx}>
                <p className="plaque">from the archive</p>
                <h3 className="room-title mt-4 text-xl md:text-2xl">{random.title}</h3>
                <p className="mt-3 font-body italic leading-relaxed text-muted-foreground">{random.text}</p>
                <a href={`#${random.anchor}`} className="mt-3 inline-block font-display text-xs tracking-[0.25em] text-[oklch(0.6_0.08_78)] underline-offset-4 hover:underline">
                  VISIT: {random.gallery.toUpperCase()} →
                </a>
              </div>
            ) : (
              <p className="font-body text-lg italic text-muted-foreground">The archive holds {pool.length} catalogued memories.<br />Pull one out at random.</p>
            )}
            <button
              onClick={() => setRandomIdx(Math.floor(Math.random() * pool.length))}
              className="mx-auto mt-6 inline-flex items-center gap-2 border border-[#8a6f3c] px-8 py-3 font-display text-sm tracking-[0.25em] text-[oklch(0.5_0.07_75)] transition-all duration-200 hover:bg-[#c9a45c]/15 focus:outline-none focus:ring-2 focus:ring-ring active:scale-[0.97] dark:text-[#e8cd8c]"
            >
              <Shuffle size={14} /> RANDOM MEMORY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
