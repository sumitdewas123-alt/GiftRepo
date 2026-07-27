/*
 * Spec — Secret Keyboard Easter Eggs:
 * CHICKO → museum lights flicker, the bird chirps. Nothing else happens.
 * WEAKMEMORY → sticky note falls from ceiling: "I forgot where I kept the next clue."
 * TOUGHGUY → tiny boxing glove appears briefly on the Archivist.
 * BOOKS → every bookshelf glows for a few seconds.
 * DESTINY → constellation stars rearrange into a compass ("Maybe not destiny. Maybe direction.")
 * Konami code → unlocks the hidden room (kept from v1).
 */
import { useEffect, useState } from "react";
import { useMuseum } from "@/contexts/MuseumContext";
import { soundEngine } from "@/lib/soundEngine";
import { toast } from "sonner";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function EasterEggs() {
  const { unlockHidden, setToughGuyMode, bloomFlowers, flowersBlooming, glowBooks, flickerLights, lightsFlicker } = useMuseum();
  const [stickyFalling, setStickyFalling] = useState(false);
  const [glove, setGlove] = useState(false);

  useEffect(() => {
    let typed = "";
    let konamiIdx = 0;

    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[konamiIdx];
      if (e.key === expected || e.key.toLowerCase() === expected) {
        konamiIdx++;
        if (konamiIdx === KONAMI.length) {
          konamiIdx = 0;
          unlockHidden("Konami code — a true classic");
        }
      } else {
        konamiIdx = e.key === KONAMI[0] ? 1 : 0;
      }

      // typed word eggs — ignore when typing in form fields
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (e.key.length === 1) {
        typed = (typed + e.key.toLowerCase()).slice(-24);
        const clean = typed.replace(/\s+/g, "");
        if (clean.includes("weakmemory")) {
          typed = "";
          setStickyFalling(true);
          setTimeout(() => setStickyFalling(false), 8000);
        } else if (clean.includes("toughguy")) {
          typed = "";
          setToughGuyMode(true);
          setGlove(true);
          setTimeout(() => setGlove(false), 6000);
        } else if (clean.includes("chicko")) {
          typed = "";
          flickerLights();
          soundEngine.chime();
          bloomFlowers();
        } else if (clean.includes("destiny")) {
          typed = "";
          window.dispatchEvent(new Event("moc-destiny"));
          toast("✨ Somewhere, the stars are rearranging…", { description: "Visit the Constellation Room to see it.", duration: 6000 });
        } else if (clean.includes("books")) {
          typed = "";
          glowBooks();
          toast("📚 Every bookshelf in the museum glows softly.", { duration: 4000 });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlockHidden, setToughGuyMode, bloomFlowers, glowBooks, flickerLights]);

  return (
    <>
      {/* CHICKO — lights flicker */}
      {lightsFlicker && (
        <div className="pointer-events-none fixed inset-0 z-[75] bg-black" aria-hidden="true" style={{ animation: "lightsFlicker 2.5s steps(2, jump-none) both" }}>
          <style>{`@keyframes lightsFlicker { 0% { opacity: 0; } 12% { opacity: 0.55; } 20% { opacity: 0; } 34% { opacity: 0.4; } 42% { opacity: 0; } 60% { opacity: 0.5; } 70% { opacity: 0; } 100% { opacity: 0; } }`}</style>
        </div>
      )}

      {/* CHICKO — flowers bloom (kept as gentle bonus) */}
      {flowersBlooming && (
        <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-3xl md:text-4xl"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animation: `bloomIn 1.2s cubic-bezier(0.23,1,0.32,1) ${i * 0.15}s both, floatSlow 4s ease-in-out ${i * 0.2}s infinite`,
              }}
            >
              {["🌸", "🌼", "🌺", "🌷", "💮"][i % 5]}
            </span>
          ))}
          <p className="absolute bottom-10 left-1/2 -translate-x-1/2 font-hand text-3xl text-[#8a6f3c] drop-shadow" style={{ animation: "fadeUp 1.5s ease 1s both" }}>
            the lights flicker. somewhere, a bird chirps.
          </p>
        </div>
      )}

      {/* WEAKMEMORY — sticky note falls from the ceiling */}
      {stickyFalling && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[75] flex justify-center" aria-live="polite">
          <div
            className="sticky-note mt-0 max-w-[15rem] p-5 font-hand text-xl leading-snug text-[#4a3c1a] shadow-2xl"
            style={{ animation: "stickyFall 2.8s cubic-bezier(0.34,1.2,0.64,1) both", transform: "rotate(-3deg)" }}
            role="note"
          >
            "I forgot where I kept the next clue."
          </div>
          <style>{`@keyframes stickyFall { from { transform: translateY(-120%) rotate(8deg); } 70% { transform: translateY(24vh) rotate(-4deg); } to { transform: translateY(22vh) rotate(-3deg); } }`}</style>
        </div>
      )}

      {/* TOUGHGUY — tiny boxing glove on the Archivist */}
      {glove && (
        <div className="pointer-events-none fixed bottom-24 right-8 z-[75] text-center" aria-live="polite">
          <span className="text-3xl" style={{ animation: "bloomIn 0.8s cubic-bezier(0.23,1,0.32,1) both" }} aria-hidden="true">🥊</span>
          <p className="font-hand text-lg text-[#8a6f3c] drop-shadow" style={{ animation: "fadeUp 1s ease 0.5s both" }}>
            the Archivist is now armed.<br />still tough.
          </p>
        </div>
      )}
    </>
  );
}
