/* Gilded Archive — Gallery 8: polaroids on strings; flip on hover/click; slideshow mode */
import { useEffect, useState } from "react";
import RoomSection from "@/components/RoomSection";
import { polaroids } from "@/lib/museumData";
import { Play, Pause } from "lucide-react";

function PolaroidCard({ p, flipped, onFlip, index }: { p: (typeof polaroids)[0]; flipped: boolean; onFlip: () => void; index: number }) {
  return (
    <div className="relative pt-6" style={{ animation: `swing ${6 + (index % 3)}s ease-in-out infinite`, transformOrigin: "top center" }}>
      {/* string clip */}
      <span className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-[#8a6f3c]" aria-hidden="true" />
      <span className="absolute left-1/2 top-5 z-10 h-3 w-4 -translate-x-1/2 rounded-sm bg-[#a8894e] shadow" aria-hidden="true" />
      <button
        onClick={onFlip}
        aria-label={flipped ? `Hide memory behind photo: ${p.caption}` : `Flip photo: ${p.caption}`}
        className="block w-40 focus:outline-none focus:ring-2 focus:ring-ring md:w-44 [perspective:800px]"
      >
        <div
          className="relative h-52 w-full transition-transform duration-700 [transform-style:preserve-3d] md:h-56"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}
        >
          {/* front */}
          <div className="absolute inset-0 bg-white p-2.5 pb-8 shadow-lg [backface-visibility:hidden]">
            {p.image ? (
              <img
                src={p.image}
                alt={p.caption}
                className="h-36 w-full object-cover md:h-40"
              />
            ) : (
              <div
                className="flex h-36 items-center justify-center text-4xl md:h-40"
                style={{ background: `linear-gradient(135deg, hsl(${p.hue}, 30%, 75%), hsl(${p.hue + 30}, 25%, 60%))` }}
                aria-label="Placeholder photo — replace with a real photograph"
              >
                📷
              </div>
            )}
            <p className="mt-2 text-center font-hand text-lg text-[#4a3c1a]">{p.caption}</p>
          </div>
          {/* back */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#f6efdd] p-4 shadow-lg [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
            <p className="text-center font-hand text-lg leading-snug text-[#5a4327]">{p.back}</p>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function Gallery8Photos() {
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [slideshow, setSlideshow] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (!slideshow) return;
    const iv = setInterval(() => {
      setSlideIdx((i) => {
        const next = (i + 1) % polaroids.length;
        setFlipped(new Set([polaroids[next].id]));
        return next;
      });
    }, 3200);
    setFlipped(new Set([polaroids[slideIdx].id]));
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideshow]);

  const toggleFlip = (id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <RoomSection id="gallery-8" plaque="gallery eight" title="The Photo Room" subtitle="Flip a photograph. The truth is always written on the back." tone="parchment">
      {/* hanging string */}
      <div className="relative">
        <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a6f3c] to-transparent" aria-hidden="true" />
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {polaroids.map((p, i) => (
            <PolaroidCard key={p.id} p={p} index={i} flipped={flipped.has(p.id)} onFlip={() => toggleFlip(p.id)} />
          ))}
        </div>
      </div>
      <div className="mt-10 text-center">
        <button
          onClick={() => setSlideshow((v) => !v)}
          aria-pressed={slideshow}
          className="inline-flex items-center gap-2 border border-border bg-card px-6 py-2.5 font-display text-xs tracking-[0.25em] transition-all duration-200 hover:border-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring active:scale-[0.97]"
        >
          {slideshow ? <Pause size={14} /> : <Play size={14} />} {slideshow ? "PAUSE SLIDESHOW" : "SLIDESHOW MODE"}
        </button>
      </div>
    </RoomSection>
  );
}
