/* Spec — Gallery 10: The Constellation Room. "Some memories shine long after the moment ends."
 * Every star = one memory (exact list). Brightest star locked until every gallery is visited.
 * DESTINY keyboard egg rearranges stars into a compass. Moon egg (5 clicks) kept. */
import { useEffect, useState } from "react";
import RoomSection from "@/components/RoomSection";
import { stars, brightestStarText, type Star } from "@/lib/museumData";
import { useMuseum, ROOM_IDS } from "@/contexts/MuseumContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const NIGHT_BG = "/manus-storage/constellation-room_756f4767.png";

export default function Gallery10Constellation() {
  const [selected, setSelected] = useState<Star | null>(null);
  const [moonClicks, setMoonClicks] = useState(0);
  const [poemOpen, setPoemOpen] = useState(false);
  const [brightestOpen, setBrightestOpen] = useState(false);
  const [compass, setCompass] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const { visited, award } = useMuseum();
  const galleriesOnly = ROOM_IDS.filter((r) => r.startsWith("gallery"));
  const brightestUnlocked = galleriesOnly.every((r) => visited.has(r));

  // DESTINY egg — listen for custom event from EasterEggs
  useEffect(() => {
    const handler = () => {
      setCompass(true);
      setTimeout(() => setCompass(false), 8000);
    };
    window.addEventListener("moc-destiny", handler);
    return () => window.removeEventListener("moc-destiny", handler);
  }, []);

  const clickMoon = () => {
    const n = moonClicks + 1;
    setMoonClicks(n);
    if (n >= 5) { setPoemOpen(true); setMoonClicks(0); }
  };

  const openStar = (s: Star) => {
    setSelected(s);
    setSeen((prev) => {
      const next = new Set(prev);
      next.add(s.id);
      if (stars.every((x) => next.has(x.id))) award("stargazer");
      return next;
    });
  };

  // compass star layout: ring + N/S/E/W points
  const compassPos = (i: number) => {
    const angle = (i / stars.length) * Math.PI * 2;
    return { left: `${50 + Math.cos(angle) * 30}%`, top: `${48 + Math.sin(angle) * 32}%` };
  };

  return (
    <RoomSection id="gallery-10" plaque="gallery ten" title="The Constellation Room" subtitle="Some memories shine long after the moment ends." bgImage={NIGHT_BG} tone="night">
      <div className="relative mx-auto h-[28rem] max-w-4xl overflow-hidden rounded border border-[#c9a45c]/25 bg-[oklch(0.16_0.03_265/70%)] shadow-2xl backdrop-blur-sm md:h-[32rem]" role="group" aria-label="Interactive night sky">
        {/* moon */}
        <button
          onClick={clickMoon}
          aria-label="The moon (it responds to persistence)"
          className="absolute right-[8%] top-[10%] text-5xl transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] md:text-6xl"
          style={{ filter: "drop-shadow(0 0 18px rgba(232,205,140,0.5))" }}
        >
          🌙
        </button>

        {/* brightest star */}
        <button
          onClick={() => brightestUnlocked && setBrightestOpen(true)}
          aria-label={brightestUnlocked ? "The brightest star — now open" : "The brightest star — locked until every gallery has been visited"}
          aria-disabled={!brightestUnlocked}
          className={`absolute left-[50%] top-[8%] -translate-x-1/2 p-2 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] ${brightestUnlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          <span
            className={`block rounded-full transition-all duration-700 ${brightestUnlocked ? "bg-[#fff3cf]" : "bg-[#f2e2b0]/40"}`}
            style={{
              width: 16, height: 16,
              boxShadow: brightestUnlocked ? "0 0 30px 8px rgba(255,240,200,0.9)" : "0 0 8px rgba(242,226,176,0.35)",
              animation: brightestUnlocked ? "twinkle 2s ease-in-out infinite" : "none",
            }}
            aria-hidden="true"
          />
          {!brightestUnlocked && (
            <span className="mt-1 block whitespace-nowrap font-hand text-xs text-[#d8c9a5]/60">waits for you to see every room</span>
          )}
        </button>

        {stars.map((s, i) => (
          <button
            key={s.id}
            onClick={() => openStar(s)}
            aria-label={`Star memory ${i + 1}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2 p-2 transition-all duration-1000 focus:outline-none"
            style={compass ? compassPos(i) : { left: `${s.x}%`, top: `${s.y}%` }}
          >
            <span
              className="block rounded-full bg-[#f2e2b0] transition-transform duration-200 group-hover:scale-[1.8] group-focus:scale-[1.8]"
              style={{
                width: s.size * 2.5, height: s.size * 2.5,
                boxShadow: `0 0 ${s.size * 4}px rgba(242,226,176,0.8)`,
                animation: `twinkle ${2.5 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
              }}
              aria-hidden="true"
            />
            {seen.has(s.id) && <span className="absolute -right-0.5 -top-0.5 text-[9px] text-[#c9a45c]" aria-hidden="true">✓</span>}
          </button>
        ))}

        {compass && (
          <p className="absolute left-1/2 top-[46%] -translate-x-1/2 text-center font-hand text-2xl text-[#e8cd8c]" style={{ animation: "fadeIn 1.5s ease both" }} role="note">
            "Maybe not destiny.<br />Maybe direction."
          </p>
        )}
        <p className="absolute bottom-4 left-1/2 w-full -translate-x-1/2 text-center font-hand text-lg text-[#d8c9a5]/70">
          hover — a star glows · click — a memory appears ({seen.size}/{stars.length})
        </p>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="border-[#c9a45c]/40 bg-[oklch(0.2_0.03_265)] text-[#efe2c2]">
          <DialogHeader>
            <DialogTitle className="room-title text-2xl text-[#e8cd8c]">⭐ A Star, Catalogued</DialogTitle>
            <DialogDescription className="font-display text-xs tracking-[0.25em] text-[#c9a45c]/80">CONSTELLATION: US</DialogDescription>
          </DialogHeader>
          <p className="font-body text-lg italic leading-relaxed">{selected?.memory}</p>
        </DialogContent>
      </Dialog>

      {/* Brightest star */}
      <Dialog open={brightestOpen} onOpenChange={setBrightestOpen}>
        <DialogContent className="border-[#c9a45c]/40 bg-[oklch(0.2_0.03_265)] text-[#efe2c2]">
          <DialogHeader>
            <DialogTitle className="room-title text-2xl text-[#e8cd8c]">The Brightest Star</DialogTitle>
            <DialogDescription className="font-display text-xs tracking-[0.25em] text-[#c9a45c]/80">UNLOCKED · EVERY ROOM VISITED</DialogDescription>
          </DialogHeader>
          <p className="font-hand text-2xl leading-relaxed">{brightestStarText}</p>
        </DialogContent>
      </Dialog>

      {/* Hidden poem — moon clicked 5 times */}
      <Dialog open={poemOpen} onOpenChange={setPoemOpen}>
        <DialogContent className="border-[#c9a45c]/40 bg-[oklch(0.2_0.03_265)] text-[#efe2c2]">
          <DialogHeader>
            <DialogTitle className="room-title text-2xl text-[#e8cd8c]">🌙 The Moon's Secret</DialogTitle>
            <DialogDescription className="font-display text-xs tracking-[0.25em] text-[#c9a45c]/80">FOUND BY THE PERSISTENT ONLY</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 font-body italic leading-relaxed">
            <p>Some people arrive like fireworks —<br />loud, bright, briefly.</p>
            <p>You arrived like moonrise:<br />quietly, on time,<br />and suddenly everything<br />had more light in it.</p>
            <p>The stars up there are memories.<br />The moon is just me,<br />still keeping watch<br />over all of them.</p>
          </div>
        </DialogContent>
      </Dialog>
    </RoomSection>
  );
}
